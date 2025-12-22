import { useEffect, useState, useMemo } from 'react'
import { v4 as uuidv4 } from "uuid";

import { createBoard } from '../types'
import type { KifEntry, Move } from '../types'
import { createKifData } from './useKifPlayerOrig';
import { useKifLibraryStore } from "./useKifLibraryStore";
import { useKifLibraryPersist } from "./useLibraryPersist";
import { Store } from '@mui/icons-material';
import { createEntity } from '../types';
//import { useNavigate } from 'react-router-dom';

export function useKifEntryController(){
    //const [ currentEntryId, setCurrentEntryId ] = useState<string | null>(null)
    //const [ sortedEntries, setSortedEntries] = useState<KifEntry[]>([])
    //const navigate = useNavigate()

    // カスタムフック
    const store = useKifLibraryStore()
    const persistApi = useKifLibraryPersist()

    // entitry
    const entries = store.state.library
    const sortedEntries = entries

    // 初期ロード
    useEffect(()=>{        
        // ライブラリからエントリーリストの読み込み
        persistApi.load()
            .then(store.setLibrary)
            .catch(() => store.setLibrary([]))        
            
    }, [])
    

    
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
    const persist = async (next: KifEntry[]) => {
        await persistApi.save(next)
        store.setLibrary(next)
    }


    return {
        entries,
        sortedEntries,   

        updateTitle,
        deleteEntry,        
    }
}