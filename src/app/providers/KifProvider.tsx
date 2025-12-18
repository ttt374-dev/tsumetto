import React, { createContext, useContext, type ReactNode } from "react";
import { useKifLibrary } from '../../features/kif/hooks/useKifLibrary'
import { useKifPlayer } from "../../features/kif/hooks/useKifPlayer";

import type { KifContextValue } from "../../features/kif/types/kifContextValue";

export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  const kifLibrary = useKifLibrary();
  const kifPlayer = useKifPlayer(kifLibrary.kifLibraryState.library);

  return (    
    <KifContext.Provider value={{ kifLibrary, kifPlayer }}>
      {children}
    </KifContext.Provider>
  );

};


