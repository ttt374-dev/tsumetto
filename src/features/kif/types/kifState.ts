import type { Board, Hand, KifData } from './kifData'
import type { KifEntry } from './kifEntity';
import { createBoard, createKifData } from './kifData';


// player
export type KifPlayerStateOrig = {
  kifData: KifData;
  //title: string,
  //mode: "temp" | "library";
  //playMode: "single" | "seq" | "random";
  //source?: string;

  //isMovesVisible: boolean;
  currentEntryId: string | null;
  //currentLibraryIndex: number | null
};

export type KifPlayerState = {
  board: Board,
  hands: Hand,
  moves: [],
  moveIndex: number | null,
  currentEntryId: string | null;

  kifData: KifData;  
}

///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayerState = (
  partial?: Partial<KifPlayerState>
): KifPlayerState => ({
  kifData: createKifData(),
  //isMovesVisible: false,
  currentEntryId: null,
  board: createBoard(),
  hands: {white: "", black: ""},
  moves: [],
  moveIndex: null,
  ...partial,
});
/*
// library 
export type KifLibraryState = {
  library: KifEntry[];
  sortKey: SortKey;
  sortOrder: SortOrder;
}
*/