import { useEffect, useState, useMemo } from 'react'
import { v4 as uuidv4 } from "uuid";

import type { KifEntry } from '../types'
import { useKifLibraryPersist } from "./library/useLibraryPersist";
import { parseKif } from '../domain/parser';
import { createKifEntryFromText, validateTitle, createKifEntry, splitFilename, resolveUniqTitle} from '../domain/factory/KifEntryFactory';
import { useProblemPersist } from './problem/useProblemPersist';
import { useProblemRepository } from './problem/useProblemRepository';
import { useProblemImporter } from './problem/useProblemImporter';

export function useKifEntryController() {
    const [ entries, setEntries ] = useState<KifEntry[]>([])
    //const persistApi = useKifLibraryPersist()
    const persistApi = useProblemPersist()
    const { importFiles } = useProblemImporter()
    
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
    /*
    const importFile = async (
        file: File,
        extraEntries: KifEntry[] = [], // importFiles から呼ぶ場合に追加分を渡す
        doPersist: boolean = true,
    ): Promise<KifEntry|null> => {
        // 拡張子チェック
        if (!file.name.toLowerCase().endsWith(".kif")){
            console.error(`invalid filename: ${file.name}`)
            return null
        }

        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        const allEntries = [...entries, ...extraEntries];
        const title = resolveUniqTitle(file.name, allEntries)
        const entry = createKifEntryFromText(text, title)        
        
        if (entry === null){   // TODO: invalid kif file
            return null
        }
        // 保存
        doPersist && await persist([...allEntries, entry]);
        return entry;
    };
    // 複数ファイルをまとめてインポート
    const importFiles = async (files: File[]): Promise<KifEntry[]> => {
        const results: KifEntry[] = [];
        for (const file of files) {
            try {
                const entry = await importFile(file, results, false);
                if (entry === null) continue
                results.push(entry);
            } catch (err) {
                console.error("Failed to import file:", file.name, err);
            }
        }
        if (results.length > 0) {
            await persist([...entries, ...results]);
        }
        return results;
    };
    */
    // エントリ更新
    const updateTitle = async (entryId: string, newTitle: string) => {
        // 重複チェック（任意）
        if (validateTitle(newTitle, entries)) throw new Error("タイトルが重複しています");

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
            await persist(nextEntries);
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