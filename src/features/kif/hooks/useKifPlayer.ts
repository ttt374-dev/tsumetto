import { useState, useEffect, useMemo } from "react";

import type { Board, KifData, KifPlayerState, KifEntry } from "../types";
import type { useKifNavigation } from "./useKifNavigation";
import { createBoard, createKifData, createPlayerState } from "../types";

export function useKifPlayer(library: KifEntry[]){
    const [state, setState] = useState<KifPlayerState>(createPlayerState());
    
    useEffect(() => {
        if (state.currentEntryId !== null){
            const currentEntry = library.find(e => e.id === state.currentEntryId)            
            const kifData = currentEntry?.kifData
            setState(prev=>createPlayerState({...prev, 
                board: kifData?.board,
                hands: kifData?.hands,
                //moves: kifData?.moves,
            }
            ))
        }
    }, [state.currentEntryId])
}