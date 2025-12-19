// hooks/useKifLibrary.ts
import { useEffect, } from "react";
import type { KifLibraryEntry } from "../types/kifLibrary";
import { useSortedKifLibrary } from "./useSortedKifLibrary";
import { useKifLibraryStore } from "./useKifLibraryStore";
import { useKifLibraryPersist } from "./useLibraryPersist";
import { useKifLibraryActions } from "./useKifLibraryActions";


export function useKifLibrary() {
  const store = useKifLibraryStore()
  const persistApi = useKifLibraryPersist()
  const library = store.state.library
  
  const sortedLibrary = useSortedKifLibrary(library, store.state.sortKey, store.state.sortOrder)
  // 初期ロード
  useEffect(() => {
    console.log("initial log on library")
    persistApi.load()
      .then(store.setLibrary)
      .catch(() => store.setLibrary([]))
  }, [])

  const persist = async (next: KifLibraryEntry[]) => {
    await persistApi.save(next)
    store.setLibrary(next)
  }

  const findById = (id: string) => library.find((e) => e.id === id);
 const actions = useKifLibraryActions(
    store.state.library,
    persist
  )
  const replaceAll = async (entries: KifLibraryEntry[]) => {
    console.log("library replaceAll", entries)
    
    await persistApi.save(entries)
    store.setLibrary(entries)
  }

  return {
    ...store.state,
    sortedLibrary,
    ...actions,    

    findById,
    setSortKey: store.setSortKey,
    replaceAll,
    toggleSortOrder: store.toggleSortOrder,
  };
}
