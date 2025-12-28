import React, { createContext, useContext, type ReactNode, useMemo, useEffect, useRef } from "react";
import { useKifLearning } from "../../features/kif/hooks/learning/useKifLearning";
import type { KifContextValue } from "../../features/kif/types/kifContextValue";
import { useKifEntryController } from "../../features/kif/hooks/useKifEntryController";
import { useKifSortedEntries } from "../../features/kif/hooks/library/useKifSortedEntries";
import { useKifLibrarySort } from "../../features/kif/hooks/library/useKifLibrarySort";
import type { SortState, KifEntry } from "../../features/kif/types";
import { useKifFilteredEntries } from "../../features/kif/hooks/useKifFilteredEntries";
export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  //const kifLibrary = useKifLibrary();  
  console.error("KifProvider MOUNT", Math.random());
  
  const kifLearning = useKifLearning()
  const kifEntryController = useKifEntryController()

  const entries = kifEntryController.entries
  const kifLibrarySort = useKifLibrarySort()  
  const sort = kifLibrarySort.sort
  const { records } = kifLearning  

  // フィルターをまず適用する
  const filteredEntries = useKifFilteredEntries(entries, records)
  // その後ソート
  const sortedEntries = useKifSortedEntries(filteredEntries, records, sort,)
  const queue = useMemo(() => sortedEntries.map(e => e.id), [sortedEntries])
  const entryMap = useMemo(() => {
    const map: Record<string, KifEntry> = {};
    entries.forEach(e => { map[e.id] = e; });
    return map;
  }, [entries]);

  const prevSortRef = useRef<SortState | null>(null);

  //const kifPlayer = useKifPlayer(sortedEntries);
  //const kifNavigation = useKifNavigation(sortedEntries)
  
  //const kifPlayer = useKifPlayer(entries);
  //const kifNavigation = useKifNavigation(entries)
  useEffect(() => {
    console.log("provider sort", kifLibrarySort.sort)
  }, [kifLibrarySort.sort])

  return (    
    <KifContext.Provider value={{ 
       kifLearning, 
       kifEntryController, kifLibrarySort, 
       sortedEntries, queue, entryMap }}>
      {children}
    </KifContext.Provider>
  );

};


