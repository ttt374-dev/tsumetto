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
    const [ currentEntryId, setCurrentEntryId ] = useState<string | null>(null)
    //const [ sortedEntries, setSortedEntries] = useState<KifEntry[]>([])
    //const navigate = useNavigate()

    // カスタムフック
    const store = useKifLibraryStore()
    const persistApi = useKifLibraryPersist()

    // entitry
    const sortedEntries = store.state.library

    // 初期ロード
    useEffect(()=>{        
        // ライブラリからエントリーリストの読み込み
        persistApi.load()
            .then(store.setLibrary)
            .catch(() => store.setLibrary([]))
        store.state.library.length > 0 &&
            setCurrentEntryId(store.state.library[0].id)
            
    }, [])

    // ナビゲーター
    const navigateTo = (dest: string) => {
        if (!currentEntryId) return;
        const currentIndex = sortedEntries.findIndex(e => e.id === currentEntryId)        
        console.log("current index", currentIndex)
        

        switch(dest){
            case 'prev':
                if (currentIndex <= 0) return
                const prev = sortedEntries[currentIndex - 1]        
                if (!prev) return
                console.log("navigate to prev", prev.id)
                setCurrentEntryId(prev.id)
                break;
            case 'next':
                if (currentIndex < 0) return
                const next = sortedEntries[currentIndex + 1]        
                if (!next) return
                setCurrentEntryId(next.id)
                console.log("navigate to next", next.id)
                break
            default:
                break;
        }
    }


    const currentEntry = useMemo(() => {
        if (currentEntryId === null) return null
        else return sortedEntries.find(e => e.id === currentEntryId) ?? null
    }, [currentEntryId, sortedEntries ])

        

    //const importFile = (file: File) => {}
    //const selectEntry = (id: string) => {}
    //const selectNextEntry = () => {}
    //const selectPrevEntry = () => {}

    return {
        currentEntry,
        currentEntryId,
        setCurrentEntryId,
        sortedEntries,   

        navigateTo,
        //selectEntry,
        //selectNextEntry,
        //selectPrevEntry,
    }
}