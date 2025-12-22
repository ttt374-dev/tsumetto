import React, { createContext, useContext, type ReactNode } from "react";
import { useKifLibrary } from '../../features/kif/hooks/useKifLibrary'
import { useKifPlayer } from "../../features/kif/hooks/useKifPlayer";
import { useKifLearning } from "../../features/kif/hooks/useKifLearning";
import { useKifNavigation } from '../../features/kif/hooks/useKifNavigation'
import { useKifPlayerUI } from "../../features/kif/hooks/useKifPlayerUI";

import type { KifContextValue } from "../../features/kif/types/kifContextValue";
import { useKifEntryController } from "../../features/kif/hooks/useKifEntryController";

export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  const kifLibrary = useKifLibrary();  
  const kifPlayer = useKifPlayer(kifLibrary.library);
  const kifLearning = useKifLearning()
  const kifPlayerUI = useKifPlayerUI()
  const kifEntryController = useKifEntryController()
  const kifNavigation = useKifNavigation(kifEntryController.sortedEntries)
  
  return (    
    <KifContext.Provider value={{ 
      kifLibrary, kifPlayer, kifLearning, kifNavigation, kifPlayerUI, kifEntryController }}>
      {children}
    </KifContext.Provider>
  );

};


