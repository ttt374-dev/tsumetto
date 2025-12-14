import { useState } from 'react'
import { parseKif } from "../kifParser";
import { type Board,type KifData, type KifPlayerState } from "../types";

export function useKifPlayer() {
    const [kifPlayerState, setKifPlayerState] =
        useState<KifPlayerState>(createPlayState());

    const loadFromText = (text: string, title?: string) => {               
        setKifPlayerState(createPlayState({kifData: parseKif(text), title: title}));
    };
    const loadFromFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        loadFromText(text, file.name);
    };

    return { kifPlayerState, loadFromText, loadFromFile };
}
  
///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayState = (
  partial?: Partial<KifPlayerState>
): KifPlayerState => ({
  kifData: null,  
  showAnswer: false,  
  title: "",
  ...partial,
});

export function createKifData(
  partial?: Partial<KifData>
): KifData {
  return {
    board: createEmptyBoard(),
    hands: { black: "", white: "" },
    moves: [],
    ...partial,
  };
}


export const createEmptyBoard = (): Board =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );
