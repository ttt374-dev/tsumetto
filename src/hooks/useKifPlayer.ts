import { useState, useEffect } from "react";
import { type KifData, type KifPlayerState, type KifLibraryEntry, type Board } from "../types";


export function useKifPlayer(library: KifLibraryEntry[], indexToPlay?: number | null) {
  const [state, setState] = useState<KifPlayerState>(createPlayerState());

  useEffect(() => {
          // selectedIndex が外部から渡される場合はそれを優先
    if (library.length > 0) {
      if (indexToPlay != null && library[indexToPlay]) {
        playAtIndex(indexToPlay);
      } else {
        // なければ先頭棋譜をロード
        playFirst();
      }
    }
  }, [library, indexToPlay]);


  /* =============================
   * reducer想定の「アクション関数」
   * ============================= */
  /** TOGGLE_SHOW_MOVES */
    //const [ movesVisible, setMovesVisible ] = useState(false)
    const toggleShowMoves = () => {
        setState((prev) => 
          createPlayerState({...prev, showMoves: !prev.showMoves})
      )
    }


  /** SELECT_LIBRARY */
  const playAtIndex = (index: number) => {
    const entry = library[index];
    if (!entry) return;

    setState((prev) =>
      createPlayerState({
        ...prev,
        kifData: entry.kifData,
        currentLibraryIndex: index,
        showMoves: false,
      })
    );
  };

  /** PLAY_FIRST */
  const playFirst = () => {
    setState(prev => {
      if (library.length === 0) return prev;

      const entry = library[0]
      return createPlayerState({...prev, kifData: entry.kifData, showMoves: false, currentLibraryIndex: 0})
    })
  }
  /** PLAY_NEXT */
  const playNext = () => {
    setState(prev => {
      if (library.length === 0) return prev;
      const next =
        ((prev.currentLibraryIndex ?? -1) + 1) % library.length;
      const entry = library[next];
      return createPlayerState({
        ...prev,
        kifData: entry.kifData,
        currentLibraryIndex: next,
        showMoves: false,
      });
    });
  };
  /** PLAY_LAST */
  const playLast = () => {
    setState(prev => {
      const entry = library[library.length-1]
      return createPlayerState({...prev, kifData: entry.kifData, showMoves: false, currentLibraryIndex: library.length-1})
    })
  }

  /** PLAY_PREV */
  const playPrev = () => {
    setState(prev => {
      if (library.length === 0) return prev;

      const current = prev.currentLibraryIndex ?? 0;
      const prevIndex = current === 0 ? library.length - 1 : current - 1;
      const entry = library[prevIndex];

      return createPlayerState({
        ...prev,
        kifData: entry.kifData,
        currentLibraryIndex: prevIndex,
        showMoves: false,
      });
    });
  };


  return {
    kifPlayerState: state,
    library,
    toggleShowMoves,
    playAtIndex,
    playFirst,
    playNext,
    playPrev,
    playLast,
  };
}

///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayerState = (
  partial?: Partial<KifPlayerState>
): KifPlayerState => ({
  kifData: createKifData(),
  showMoves: false,
  ...partial,
});

export function createKifData(
  partial?: Partial<KifData>
): KifData {
  return {
    board: createBoard(),
    hands: { black: "", white: "" },
    moves: [],
    title: "",
    ...partial,
  };
}

export const createBoard = (): Board =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );
