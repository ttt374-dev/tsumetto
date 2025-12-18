import { v4 as uuidv4 } from "uuid";
import { parseKif } from "../utils/kifParser";
import { type KifLibraryEntry, type KifLibraryState } from "../types/kifLibrary";


export function useKifLibraryActions(
    library: KifLibraryEntry[],
    persist: (next: KifLibraryEntry[]) => Promise<void>
) {

    // 単体ファイルをインポートして保存
    const importFile = async (
        file: File,
        extraEntries: KifLibraryEntry[] = [] // importFiles から呼ぶ場合に追加分を渡す
    ): Promise<KifLibraryEntry> => {
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

        const entry: KifLibraryEntry = {
            id: uuidv4(),
            kifData,
            createdAt: Date.now(),
        };

        // 保存
        await persist([...library, ...extraEntries, entry]);
        return entry;
    };

    // 複数ファイルをまとめてインポート
    const importFiles = async (files: File[]): Promise<KifLibraryEntry[]> => {
        const results: KifLibraryEntry[] = [];
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

    const deleteEntry = async (entry: KifLibraryEntry) => {
        try {
            const nextLibrary = library.filter((e) => e.id !== entry.id);
            await persist(nextLibrary);
            //setLibrary(nextLibrary)
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    };
    const deleteEntries = async (entries: KifLibraryEntry[]) => {
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

    return { importFile, importFiles, deleteEntry, deleteEntries };
}
