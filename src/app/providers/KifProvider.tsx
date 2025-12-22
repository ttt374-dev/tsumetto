import React, { createContext, useContext, type ReactNode } from "react";
import { useKifLibrary } from '../../features/kif/hooks/useKifLibrary'
import { useKifPlayer } from "../../features/kif/hooks/useKifPlayer";
import { useKifLearning } from "../../features/kif/hooks/useKifLearning";
import { useKifNavigation } from '../../features/kif/hooks/useKifNavigation'
import { useKifPlayerUI } from "../../features/kif/hooks/useKifPlayerUI";

import type { KifContextValue } from "../../features/kif/types/kifContextValue";

export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  const kifLibrary = useKifLibrary();
  const kifNavigation = useKifNavigation()
  const kifPlayer = useKifPlayer(kifLibrary.library);
  const kifLearning = useKifLearning()
  const kifPlayerUI = useKifPlayerUI()
  
  return (    
    <KifContext.Provider value={{ kifLibrary, kifPlayer, kifLearning, kifNavigation, kifPlayerUI }}>
      {children}
    </KifContext.Provider>
  );

};


