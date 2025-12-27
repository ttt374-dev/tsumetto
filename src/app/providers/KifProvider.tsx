import React, { createContext, useContext, type ReactNode, useEffect, useRef } from "react";
//import { useKifLibrary } from '../../features/kif/hooks/useKifLibrary'
//import { useKifPlayer } from "../../features/kif/hooks/player/useKifPlayer";
import { useKifLearning } from "../../features/kif/hooks/learning/useKifLearning";
import { useKifNavigation } from '../../features/kif/hooks/useKifNavigation'
import { useKifPlayerUI } from "../../features/kif/hooks/player/useKifPlayerUI";

import type { KifContextValue } from "../../features/kif/types/kifContextValue";
import { useKifEntryController } from "../../features/kif/hooks/useKifEntryController";
import { useKifSortedEntries } from "../../features/kif/hooks/library/useKifSortedEntries";
import { useKifLibrarySort } from "../../features/kif/hooks/library/useKifLibrarySort";
import type { SortState } from "../../features/kif/types";

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
  const sortedEntries = useKifSortedEntries(entries, records, sort,)

  useEffect(() => {
  console.warn(
    "PROVIDER sortedEntries",
    sortedEntries.map(e => e.id)
  );
}, [sortedEntries]);

useEffect(() => {
  console.warn("SORT identity", kifLibrarySort.sort);
}, [sort]);

const prevSortRef = useRef<SortState | null>(null);

useEffect(() => {
  console.warn(
    "SORT same?",
    prevSortRef.current === kifLibrarySort.sort
  );
  prevSortRef.current = kifLibrarySort.sort;
}, [kifLibrarySort.sort]);


  //nsole.log("sorted entries on provider", sortedEntries, kifLibrarySort.sort)

  //const kifPlayer = useKifPlayer(sortedEntries);
  const kifNavigation = useKifNavigation(sortedEntries)
  
  //const kifPlayer = useKifPlayer(entries);
  //const kifNavigation = useKifNavigation(entries)
  useEffect(() => {
  console.log("provider sort", kifLibrarySort.sort)
}, [kifLibrarySort.sort])

  return (    
    <KifContext.Provider value={{ 
       kifLearning, kifNavigation, 
       kifEntryController, kifLibrarySort, sortedEntries }}>
      {children}
    </KifContext.Provider>
  );

};


