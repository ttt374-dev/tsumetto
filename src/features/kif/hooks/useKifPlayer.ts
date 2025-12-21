import { useState, useEffect, useMemo } from "react";

import { type Board, type KifData, type KifPlayerState } from "../types/kif";
import { type KifLibraryEntry, } from '../types/kifLibrary'
import type { useKifNavigation } from "./useKifNavigation";


export function useKifPlayer(library: KifLibraryEntry[], navigation: ReturnType<typeof useKifNavigation>) {
  const [state, setState] = useState<KifPlayerState>(createPlayerState());
  //const [currentEntryId, setCurrentEntryId] = useState<string | undefined>();

  /* =====================
   * 派生値
   * ===================== */
  //const currentEntryId = navigation.currentEntryId
  const currentEntryId = state.currentEntryId
  const currentEntry = useMemo(() => {
    if (!currentEntryId) return undefined;
    return library.find(e => e.id === currentEntryId);
  }, [library, currentEntryId]);


  /* =====================
   * entryId → state 同期
   * ===================== */

  useEffect(() => {
    if (!currentEntry) {
      //reset()
    } else {

      setState(prev =>
        createPlayerState({
          ...prev,
          kifData: currentEntry.kifData,
        })
      );
    }
  }, [currentEntry]);

  /*
useEffect(() => {
  if (currentEntryId && !currentEntry) {
    console.log("player to reset")
    reset();
    //setCurrentEntryId(null);
    
  }
}, [currentEntry, currentEntryId]);
*/
  /* =====================
   * library 変更時の補正
   * ===================== */
  useEffect(() => {
    if (!currentEntryId && library.length > 0) {
      playByEntryId(library[0].id);
      return;
    }

    if (
      currentEntryId &&
      !library.some(e => e.id === currentEntryId)
    ) {
      playByEntryId(library[0]?.id);
    }
  }, [library, currentEntryId]);


  /* =====================
   * 操作系
   * ===================== */

  function playByEntryId(entryId: string) {
    setState(prev => ({
      ...prev,
      isMovesVisible: false,
      currentEntryId: entryId,
    }));
  }
  /*
  function playAtIndex(index: number) {
    const entry = library[index];
    if (!entry) return;
    playByEntryId(entry.id);
  }
    */
/*
  function playFirst() {
    if (library.length === 0) return;
    playByEntryId(library[0].id);
  }
  function playLast() {
    if (library.length === 0) return;
    playByEntryId(library[library.length - 1].id);
  }*/
  function playFirst(list: KifLibraryEntry[]) {
    if (list.length === 0) return;
    playByEntryId(list[0].id);
  }

  function playLast(list: KifLibraryEntry[]) {
    if (list.length === 0) return;
    playByEntryId(list[list.length - 1].id);
  }

    /*
    function playNext() {
    if (currentIndex == null) return;
    const next = library[currentIndex + 1];
    if (!next) return;
    playByEntryId(next.id);
  }*/
  function playNext(list: KifLibraryEntry[]) {
    if (!currentEntryId) return;

    const idx = list.findIndex(e => e.id === currentEntryId);
    if (idx < 0) return;

    const next = list[idx + 1];
    if (!next) return;

    playByEntryId(next.id);
  }
/*
  function playPrev() {
    if (currentIndex == null) return;
    const prev = library[currentIndex - 1];
    if (!prev) return;
    playByEntryId(prev.id);
  }
*/
  function playPrev(list: KifLibraryEntry[]) {
    if (!currentEntryId) return;

    const idx = list.findIndex(e => e.id === currentEntryId);
    if (idx <= 0) return;

    const prev = list[idx - 1];
    if (!prev) return;

    playByEntryId(prev.id);
  }
/*
  function showMoves(){
    setState(prev => createPlayerState({...prev, isMovesVisible: true}))
  }
  function hideMoves(){
    setState(prev => createPlayerState({...prev, isMovesVisible: false}))
  }
  function toggleMovesVisible() {
    setState(prev =>
      createPlayerState({
        ...prev,
        isMovesVisible: !prev.isMovesVisible,
      })
    );
  }
    */
  function reset() {
    setState(prev => createPlayerState())    
  }

  /* =====================
   * 公開 API
   * ===================== */

  return {
    kifPlayerState: {
      ...state,
      //currentLibraryIndex: currentIndex,
    },
    playByEntryId,
    //playAtIndex,
    playFirst,
    playLast,
    playNext,
    playPrev,
    //showMoves,
    //hideMoves,
    //toggleShowMoves: toggleMovesVisible,
  };
}

///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayerState = (
  partial?: Partial<KifPlayerState>
): KifPlayerState => ({
  kifData: createKifData(),
  //isMovesVisible: false,
  currentEntryId: null,
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
