import { useState, useEffect, useMemo } from "react";
import { type Board, type KifData, type KifLibraryEntry, type KifPlayerState } from "../types";

export function useKifPlayer(library: KifLibraryEntry[]) {
  const [state, setState] = useState<KifPlayerState>(createPlayerState());
  //const [currentEntryId, setCurrentEntryId] = useState<string | undefined>();

  /* =====================
   * 派生値
   * ===================== */
  const currentEntry = useMemo(() => {
    if (!state.currentEntryId) return undefined;
    return library.find(e => e.id === state.currentEntryId);
  }, [library, state.currentEntryId]);

  const currentIndex = useMemo(() => {
    if (!state.currentEntryId) return undefined;
    const idx = library.findIndex(e => e.id === state.currentEntryId);
    return idx >= 0 ? idx : undefined;
  }, [library, state.currentEntryId]);


  /* =====================
   * entryId → state 同期
   * ===================== */

  useEffect(() => {
    if (!currentEntry) return;

    setState(prev =>
      createPlayerState({
        ...prev,
        kifData: currentEntry.kifData,
      })
    );
  }, [currentEntry]);

  /* =====================
   * library 変更時の補正
   * ===================== */
  useEffect(() => {
    if (!state.currentEntryId && library.length > 0) {
      playByEntryId(library[0].id);
      return;
    }

    if (
      state.currentEntryId &&
      !library.some(e => e.id === state.currentEntryId)
    ) {
      playByEntryId(library[0]?.id);
    }
  }, [library, state.currentEntryId]);


  /* =====================
   * 操作系
   * ===================== */

  function playByEntryId(entryId: string) {
    setState(prev => ({
      ...prev,
      currentEntryId: entryId,
    }));
  }
  function playAtIndex(index: number) {
    const entry = library[index];
    if (!entry) return;
    playByEntryId(entry.id);
  }

  function playFirst() {
    if (library.length === 0) return;
    playByEntryId(library[0].id);
  }
  function playLast() {
    if (library.length === 0) return;
    playByEntryId(library[library.length - 1].id);
  }
  function playNext() {
    if (currentIndex == null) return;
    const next = library[currentIndex + 1];
    if (!next) return;
    playByEntryId(next.id);
  }
  function playPrev() {
    if (currentIndex == null) return;
    const prev = library[currentIndex - 1];
    if (!prev) return;
    playByEntryId(prev.id);
  }


  function toggleShowMoves() {
    setState(prev =>
      createPlayerState({
        ...prev,
        showMoves: !prev.showMoves,
      })
    );
  }

  /* =====================
   * 公開 API
   * ===================== */

  return {
    kifPlayerState: {
      ...state,
      currentLibraryIndex: currentIndex,
    },
    playByEntryId,
    playAtIndex,
    playFirst,
    playLast,
    playNext,
    playPrev,
    toggleShowMoves,
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
    //createdAt: Date.now(),
    ...partial,
  };
}

export const createBoard = (): Board =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );
