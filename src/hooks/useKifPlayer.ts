import { useState, useEffect } from "react";
import { parseKif } from "../kifParser";
import { type KifData, type KifPlayerState, type KifLibraryEntry, type Board } from "../types";


export function useKifPlayer(library: KifLibraryEntry[], selectedIndex?: number | null) {
  const [state, setState] = useState<KifPlayerState>(createPlayerState());
  //const [library, setLibrary] = useState<KifLibraryEntry[]>([]);
  // 起動時または library 更新時に先頭棋譜を読み込む

  useEffect(() => {
    if (library.length === 0) {
      setState(createPlayerState());
      return;
    }

    // selectedIndex が外部から渡される場合はそれを優先
    if (selectedIndex != null && library[selectedIndex]) {
      loadFromLibrary(selectedIndex);
    } else {
      // なければ先頭棋譜をロード
      loadFromLibrary(0);
    }
  }, [library, selectedIndex]);


  /* =============================
   * reducer想定の「アクション関数」
   * ============================= */
  /** TOGGLE_SHOW_MOVES */
    //const [ movesVisible, setMovesVisible ] = useState(false)
    const toggleShowMoves = () => {
        console.log("handle toggle vis")
        setState((prev) => 
          createPlayerState({...prev, showMoves: !state.showMoves})
      )

    }

  /** LOAD_KIF */
  const loadKif = (kifData: KifData, title = "") => {
    setState((prev) =>
      createPlayerState({
        ...prev,
        kifData,
        title,
        showMoves: false,
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
      createPlayerState({
        ...prev,
        kifData: entry.kifData,
        title: entry.title,
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
      return createPlayerState({...prev, kifData: entry.kifData, title: entry.title, currentLibraryIndex: 0})
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
        title: entry.title,
        currentLibraryIndex: next,
      });
    });
  };
  /** PLAY_LAST */
  const playLast = () => {
    setState(prev => {
      const entry = library[library.length-1]
      return createPlayerState({...prev, kifData: entry.kifData, title: entry.title, currentLibraryIndex: library.length-1})
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
        title: entry.title,
        currentLibraryIndex: prevIndex,
        showMoves: false,
      });
    });
  };


  return {
    kifPlayerState: state,
    library,
    loadFromText,
    loadFromFile,
    loadFromLibrary,
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
