import React, { createContext, useContext, type ReactNode } from "react";
//import { useKifLibrary } from '../../features/kif/hooks/useKifLibrary'
import { useKifPlayer } from "../../features/kif/hooks/useKifPlayer";
import { useKifLearning } from "../../features/kif/hooks/useKifLearning";
import { useKifNavigation } from '../../features/kif/hooks/useKifNavigation'
import { useKifPlayerUI } from "../../features/kif/hooks/useKifPlayerUI";

import type { KifContextValue } from "../../features/kif/types/kifContextValue";
import { useKifEntryController } from "../../features/kif/hooks/useKifEntryController";
import { useKifSortedEntries } from "../../features/kif/hooks/useKifSortedEntities";
import { useKifLibrarySort } from "../../features/kif/hooks/useKifLilbrarySort";

export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  //const kifLibrary = useKifLibrary();  
  
  
  const kifLearning = useKifLearning()
  const kifPlayerUI = useKifPlayerUI()
  const kifEntryController = useKifEntryController()

  const entries = kifEntryController.entries
  const kifLibrarySort = useKifLibrarySort()  
  
  const sortedEntries = useKifSortedEntries(entries, kifLibrarySort.sort)
  console.log("sorted entries on provider", sortedEntries, kifLibrarySort.sort)

  const kifPlayer = useKifPlayer(sortedEntries);
  const kifNavigation = useKifNavigation(sortedEntries)
  
  //const kifPlayer = useKifPlayer(entries);
  //const kifNavigation = useKifNavigation(entries)
  

  return (    
    <KifContext.Provider value={{ 
       kifPlayer, kifLearning, kifNavigation, kifPlayerUI, 
       kifEntryController, kifLibrarySort, sortedEntries }}>
      {children}
    </KifContext.Provider>
  );

};


