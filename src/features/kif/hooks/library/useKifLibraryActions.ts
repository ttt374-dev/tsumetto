import { v4 as uuidv4 } from "uuid";
import { parseKif } from "../../utils/parser/kifParser";
import { type KifEntry } from "../../types/";


export function useKifLibraryActions(
    library: KifEntry[],
    persist: (next: KifEntry[]) => Promise<void>
) {

    // 単体ファイルをインポートして保存
    const importFile = async (
        file: File,
        extraEntries: KifEntry[] = [] // importFiles から呼ぶ場合に追加分を渡す
    ): Promise<KifEntry> => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        const kifData = parseKif(text);

        // ファイル名と拡張子を分離
        let baseName = file.name;
        let ext = "";
        const dotIndex = file.name.lastIndexOf(".");
        if (dotIndex >= 0) {
            baseName = file.name.slice(0, dotIndex);
            ext = file.name.slice(dotIndex);
        }

        // 重複チェック（既存＋追加分）
        let newTitle = baseName + ext;
        let counter = 1;
        const existingTitles = new Set([...library, ...extraEntries].map(e => e.kifData.title));
        while (existingTitles.has(newTitle)) {
            newTitle = `${baseName}(${counter})${ext}`;
            counter++;
        }
        kifData.title = newTitle;

        const entry: KifEntry = {
            id: uuidv4(),
            kifData,
            createdAt: Date.now(),
        };

        // 保存
        await persist([...library, ...extraEntries, entry]);
        return entry;
    };

    // 複数ファイルをまとめてインポート
    const importFiles = async (files: File[]): Promise<KifEntry[]> => {
        const results: KifEntry[] = [];
        for (const file of files) {
            try {
                const entry = await importFile(file, results);
                results.push(entry);
            } catch (err) {
                console.error("Failed to import file:", file.name, err);
            }
        }
        return results;
    };
    const updateTitle = async (entryId: string, newTitle: string) => {
        // 重複チェック（任意）
        const existingTitles = new Set(library.map(e => e.kifData.title));
        if (existingTitles.has(newTitle)) {
            throw new Error("タイトルが重複しています");
        }

        const nextLibrary = library.map(e =>
            e.id === entryId
                ? { ...e, kifData: { ...e.kifData, title: newTitle } }
                : e
        );

        await persist(nextLibrary);
    };

    const deleteEntry = async (entry: KifEntry) => {
        try {
            const nextLibrary = library.filter((e) => e.id !== entry.id);
            await persist(nextLibrary);
            //setLibrary(nextLibrary)
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    };
    
    const deleteEntries = async (entries: KifEntry[]) => {
        try {
            if (entries.length === 0) return;

            const deleteIds = new Set(entries.map(e => e.id));

            const nextLibrary = library.filter(
                (e) => !deleteIds.has(e.id)
            );

            //console.log("delete entries", entries, deleteIds, nextLibrary)
            await persist(nextLibrary);
            // setLibrary(nextLibrary)
        } catch (err) {
            console.error("Failed to delete entries:", err);
        }
    };

    return { importFile, importFiles, updateTitle, deleteEntry, deleteEntries };
}
