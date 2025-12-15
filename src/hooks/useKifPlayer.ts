import { useState, useEffect } from "react";
import { parseKif } from "../kifParser";
import {
  type KifData,
  type KifPlayerState,
  type KifLibraryEntry,
  type Board
} from "../types";


export function useKifPlayer(library: KifLibraryEntry[]) {
  const [state, setState] = useState<KifPlayerState>(createPlayState());
  //const [library, setLibrary] = useState<KifLibraryEntry[]>([]);

  /* =============================
   * reducer想定の「アクション関数」
   * ============================= */

  /** LOAD_KIF */
  const loadKif = (kifData: KifData, title = "") => {
    setState((prev) =>
      createPlayState({
        ...prev,
        kifData,
        title,
        showAnswer: false,
      })
    );
  };

  /** LOAD_FROM_TEXT */
  const loadFromText = (text: string, title?: string) => {
    loadKif(parseKif(text), title);
  };

  /** LOAD_FROM_FILE */
  const loadFromFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const text = new TextDecoder("shift_jis").decode(buf);
    loadFromText(text, file.name);
  };


  /** SELECT_LIBRARY */
  const loadFromLibrary = (index: number) => {
    const entry = library[index];
    if (!entry) return;

    setState((prev) =>
      createPlayState({
        ...prev,
        kifData: entry.kifData,
        title: entry.title,
        currentLibraryIndex: index,
        showAnswer: false,
      })
    );
  };

    /** PLAY_NEXT */
    const playNext = () => {
        setState(prev => {
            if (library.length === 0) return prev;
            const next =
                ((prev.currentLibraryIndex ?? -1) + 1) % library.length;
            const entry = library[next];
            return createPlayState({
                ...prev,
                kifData: entry.kifData,
                title: entry.title,
                currentLibraryIndex: next,
                showAnswer: false,
            });
        });
    };


    /** PLAY_PREV */
    const playPrev = () => {
        setState((prev) => {
            if (library.length === 0) return prev;

            const current =
                prev.currentLibraryIndex ?? library.length;

            const prevIndex =
                current - 1 < 0 ? library.length - 1 : current - 1;

            const entry = library[prevIndex];
            if (!entry) return prev;

            return createPlayState({
                ...prev,
                kifData: entry.kifData,
                title: entry.title,
                currentLibraryIndex: prevIndex,
                showAnswer: false,
            });
        });
    };


  return {
    kifPlayerState: state,
    library,
    loadFromText,
    loadFromFile,
    loadFromLibrary,
    playNext,
    playPrev,
  };
}

///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayState = (
    partial?: Partial<KifPlayerState>
): KifPlayerState => ({    
    kifData: createKifData(),
    showAnswer: false,
    title: "",
    ...partial,
});

export function createKifData(
    partial?: Partial<KifData>
): KifData {
    return {
        board: createBoard(),
        hands: { black: "", white: "" },
        moves: [],
        ...partial,
    };
}

export const createBoard = (): Board =>
    Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => null)
    );
