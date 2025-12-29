import React, { createContext, useContext, type ReactNode, useState, useMemo, useEffect, useRef } from "react";
import { useLearning } from "../../features/kif/hooks/learning/useLearningRepository";
import type { KifContextValue } from "../../features/kif/types/kifContextValue";
import { useKifSortedEntries } from "../../features/kif/hooks/library/useKifSortedEntries";
import { useKifLibrarySort } from "../../features/kif/hooks/library/useKifLibrarySort";
import type { SortState, KifEntry, DeckFilter } from "../../features/kif/types";
import { useKifFilteredEntries } from "../../features/kif/hooks/deck/useKifFilteredEntries";
import { useKifDeckFilter } from "../../features/kif/hooks/deck/useKifDeckFilter";
import { useProblemRepository } from "../../features/kif/hooks/problem/useProblemRepository";

export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  //const kifLibrary = useKifLibrary();  
  console.error("KifProvider MOUNT", Math.random());
  //const [deckFilter, setDeckFilter] = useState<DeckFilter>({unansweredOnly: false})

  const kifLearning = useLearning()
  const problemRepository = useProblemRepository()

  const entries = problemRepository.problems
  const { records } = kifLearning  

  
  // フィルターをまず適用する
  //const kifDeckFilter = useKifDeckFilter()  
  //const filteredEntries = useKifFilteredEntries(entries, records, kifDeckFilter.filter)
  // その後ソート
  //const kifLibrarySort = useKifLibrarySort()    
  //const sortedEntries = useKifSortedEntries(filteredEntries, records, kifLibrarySort.sort,)

  // キューの生成
  const queue = useMemo(() => entries.map(e => e.id), [entries])
  const entryMap = useMemo(() => {
    const map: Record<string, KifEntry> = {};
    entries.forEach(e => { map[e.id] = e; });
    return map;
  }, [entries]);

  //const prevSortRef = useRef<SortState | null>(null);

  //const kifPlayer = useKifPlayer(sortedEntries);
  //const kifNavigation = useKifNavigation(sortedEntries)
  
  //const kifPlayer = useKifPlayer(entries);
  //const kifNavigation = useKifNavigation(entries)
  
  return (    
    <KifContext.Provider value={{ 
       kifLearning, 
       //kifEntryController, 
       problemRepository,
  
       queue, entryMap,
       entries,
       
        }}>
      {children}
    </KifContext.Provider>
  );

};


