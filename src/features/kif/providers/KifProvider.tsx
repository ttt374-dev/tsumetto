import React, { createContext, useContext, type ReactNode } from "react";
import { useKifLibrary } from '../hooks/useKifLibary';
import { useKifPlayer } from "../hooks/useKifPlayer";

import type { KifContextValue } from "../types/kifContextValue";

export const KifContext = createContext<KifContextValue | null>(null);

// Provider 関数は型注釈なしで安全
export const KifProvider = ({ children }: { children: ReactNode }) => {
  const kifLibrary = useKifLibrary();
  const kifPlayer = useKifPlayer(kifLibrary.library);

  return (    
    <KifContext.Provider value={{ kifLibrary, kifPlayer }}>
      {children}
    </KifContext.Provider>
  );

};


