import { useEffect, useState, useMemo } from 'react'
import { v4 as uuidv4 } from "uuid";

import { createBoard } from '../types/'
import type { KifEntry, Move } from '../types/'
import { createKifData } from './useKifPlayerOrig';
import { useKifLibraryStore } from "./useKifLibraryStore";
import { useKifLibraryPersist } from "./useLibraryPersist";
import { Store } from '@mui/icons-material';
import { createEntity } from '../types/';

export function useKifEntityController(){
    const [ currentEntityId, setCurrentEntryId ] = useState<string | null>(null)
    //const [ sortedEntries, setSortedEntries] = useState<KifEntry[]>([])

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




    const currentEntry = useMemo(() => {
        if (currentEntityId === null) return null
        else return sortedEntries.find(e => e.id === currentEntityId) ?? null
    }, [currentEntityId, sortedEntries ])

        

    //const importFile = (file: File) => {}
    const selectEntry = (id: string) => {}
    //const selectNextEntry = () => {}
    //const selectPrevEntry = () => {}

    return {
        currentEntry,
        setCurrentEntryId,
        sortedEntries,   

        selectEntity: selectEntry,
        //selectNextEntry,
        //selectPrevEntry,
    }
}