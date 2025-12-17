import { useState, useEffect, useMemo } from "react";
import { type Board, type KifData, type KifLibraryEntry, type KifPlayerState } from "../types";

export function useKifPlayer(library: KifLibraryEntry[]) {
  const [state, setState] = useState<KifPlayerState>(createPlayerState());
  const [currentEntryId, setCurrentEntryId] = useState<string | undefined>();

  /* =====================
   * 派生値
   * ===================== */

  // 現在の entry
  const currentEntry = useMemo(() => {
    if (!currentEntryId) return undefined;
    return library.find(e => e.id === currentEntryId);
  }, [library, currentEntryId]);

  // 表示用 index（state には持たない）
  const currentIndex = useMemo(() => {
    if (!currentEntryId) return undefined;
    const idx = library.findIndex(e => e.id === currentEntryId);
    return idx >= 0 ? idx : undefined;
  }, [library, currentEntryId]);

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
    if (!currentEntryId && library.length > 0) {
      setCurrentEntryId(library[0].id);
      return;
    }

    if (
      currentEntryId &&
      !library.some(e => e.id === currentEntryId)
    ) {
      // 削除された場合 → 先頭へ
      setCurrentEntryId(library[0]?.id);
    }
  }, [library, currentEntryId]);

  /* =====================
   * 操作系
   * ===================== */

  function playByEntryId(entryId: string) {
    console.log("play by entryId", entryId)
    setCurrentEntryId(entryId);
  }

  function playFirst() {
    if (library.length === 0) return;
    setCurrentEntryId(library[0].id);
  }

  function playLast() {
    if (library.length === 0) return;
    setCurrentEntryId(library[library.length - 1].id);
  }

  function playNext() {
    if (currentIndex == null) return;
    const next = library[currentIndex + 1];
    if (next) setCurrentEntryId(next.id);
  }

  function playPrev() {
    if (currentIndex == null) return;
    const prev = library[currentIndex - 1];
    if (prev) setCurrentEntryId(prev.id);
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
      currentEntryId,
      currentLibraryIndex: currentIndex,
    },
    playByEntryId,
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
