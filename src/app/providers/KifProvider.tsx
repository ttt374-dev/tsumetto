import React, { createContext, useContext, type ReactNode, useState, useMemo, useEffect, useRef } from "react";
import { useLearningRepository } from "../../features/kif/hooks/learning/useLearningRepository";
import type { KifContextValue } from "../../features/kif/types/kifContextValue";
import { useKifSortedEntries } from "../../features/kif/hooks/library/useKifSortedEntries";
import { useKifLibrarySort } from "../../features/kif/hooks/library/useKifLibrarySort";
import type { SortState, KifEntry, DeckFilter } from "../../features/kif/types";
import { useKifFilteredEntries } from "../../features/kif/hooks/deck/useKifFilteredEntries";
import { useKifDeckFilter } from "../../features/kif/hooks/deck/useKifDeckFilter";
import { useProblemRepository } from "../../features/kif/hooks/problem/useProblemRepository";
import type { Problem } from "../../features/kif/types";
import { usePlayerSession } from "../../features/kif/hooks/session/usePlayerSession";
export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  const problemRepository = useProblemRepository()
  const learningRepository = useLearningRepository()
  
  const problems = problemRepository.problems
  const entries = problems
  const sort = useKifLibrarySort()
  const filter = useKifDeckFilter()
  const { records } = useLearningRepository()

  
  // フィルターをまず適用する
  //const kifDeckFilter = useKifDeckFilter()  
  //const filteredEntries = useKifFilteredEntries(entries, records, kifDeckFilter.filter)
  // その後ソート
  //const kifLibrarySort = useKifLibrarySort()    
  //const sortedEntries = useKifSortedEntries(filteredEntries, records, kifLibrarySort.sort,)

  // キューの生成
  const queue = useMemo(() => entries.map(e => e.id), [entries, records])
  const entryMap = useMemo(() => {
    const map: Record<string, KifEntry> = {};
    entries.forEach(e => { map[e.id] = e; });
    return map;
  }, [entries]);
  const problemMap = useMemo(() => {
    const map: Record<string, Problem> = {};
    entries.forEach(e => { map[e.id] = e; });
    return map;
  }, [problems]);
  const playerSessionApi = usePlayerSession()

  //const prevSortRef = useRef<SortState | null>(null);

  //const kifPlayer = useKifPlayer(sortedEntries);
  //const kifNavigation = useKifNavigation(sortedEntries)

  //const kifPlayer = useKifPlayer(entries);
  //const kifNavigation = useKifNavigation(entries)

  return (
    <KifContext.Provider value={{
      learningRepository,
      problemRepository,

      queue, 
      entries, entryMap,
      problems, problemMap,

      playerSessionApi,

      sort, filter,
    }}>
      {children}
    </KifContext.Provider>
  );

};


