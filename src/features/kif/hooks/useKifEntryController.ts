import { useEffect, useState, useMemo } from 'react'
import { v4 as uuidv4 } from "uuid";

import { createBoard,  } from '../types'
import type { KifEntry, Move } from '../types'
//import { createKifData } from './useKifPlayerOrig';
//import { useKifLibraryStore } from "./useKifLibraryStore";
import { useKifLibraryPersist } from "./library/useLibraryPersist";
import { Store } from '@mui/icons-material';
import { createEntity } from '../types';
import { parseKif } from "../utils/parser/kifParser";

export function useKifEntryController() {
    //const [ currentEntryId, setCurrentEntryId ] = useState<string | null>(null)
    //const [ sortedEntries, setSortedEntries] = useState<KifEntry[]>([])
    //const navigate = useNavigate()
    const [ entries, setEntries ] = useState<KifEntry[]>([])

    // カスタムフック
    //const store = useKifLibraryStore()
    const persistApi = useKifLibraryPersist()

    // entitry
    //const entries = store.state.library
    //const sortedEntries = entries

    // 初期ロード
    useEffect(() => {
        // ライブラリからエントリーリストの読み込み
        persistApi.load()
            .then(setEntries)
            .catch(() => setEntries([]))
            //.then(store.setLibrary)
            //.catch(() => store.setLibrary([]))

    }, [])

    // インポート
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
        const existingTitles = new Set([...entries, ...extraEntries].map(e => e.kifData.title));
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
        await persist([...entries, ...extraEntries, entry]);
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
    // エントリ更新
    const updateTitle = async (entryId: string, newTitle: string) => {
        // 重複チェック（任意）
        const existingTitles = new Set(entries.map(e => e.kifData.title));
        if (existingTitles.has(newTitle)) {
            throw new Error("タイトルが重複しています");
        }

        const nextEntries = entries.map(e =>
            e.id === entryId
                ? { ...e, kifData: { ...e.kifData, title: newTitle } }
                : e
        );

        await persist(nextEntries);

    };
    const deleteEntry = async (entryId: string) => {
        try {
            const nextEntries = entries.filter((e) => e.id !== entryId);
            await persist(nextEntries);
        } catch (err) {
            console.error("Failed to delete entry:", err);
        }
    }
    const deleteEntries = async (entriesToDelete: KifEntry[]) => {
            try {
                if (entriesToDelete.length === 0) return;
    
                const deleteIds = new Set(entriesToDelete.map(e => e.id));
    
                console.log("delete IDs", deleteIds)
                const nextEntries = entries.filter(
                    (e) => !deleteIds.has(e.id)
                );
                console.log("next entries", nextEntries)
                //console.log("delete entries", entries, deleteIds, nextLibrary)
                await persist(nextEntries);
                // setLibrary(nextLibrary)
            } catch (err) {
                console.error("Failed to delete entries:", err);
            }
        };
    const persist = async (next: KifEntry[]) => {
        await persistApi.save(next)
        //store.setLibrary(next)
        setEntries(next)
    }
    const replaceAll = async (entries: KifEntry[]) => {
        console.log("library replaceAll", entries)

        await persistApi.save(entries)
        setEntries(entries)
    }



    return {
        entries,

        updateTitle,
        deleteEntry,
        deleteEntries,
        importFiles,
        replaceAll,
        
    }
}