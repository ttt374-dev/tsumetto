import { useState } from 'react'
import { parseKif } from "../kifParser";
import { type KifPlayerState } from "../types";

export function useKifPlayer() {
    const [kifPlayerState, setKifPlayerState] =
        useState<KifPlayerState>(createPlayState());

    const loadFromText = (text: string, title?: string) => {               
        setKifPlayerState(createPlayState({kifData: parseKif(text), title: title}));
    };
    return { kifPlayerState, loadFromText };
}

// hooks/usePlayerState.ts
export const createPlayState = (
  partial?: Partial<KifPlayerState>
): KifPlayerState => ({
  kifData: null,  
  showAnswer: false,  
  title: "",
  ...partial,
});
