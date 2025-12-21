import type { KifData } from './kifData'

export type KifPlayerState = {
  kifData: KifData;
  //title: string,
  //mode: "temp" | "library";
  //playMode: "single" | "seq" | "random";
  //source?: string;

  //isMovesVisible: boolean;
  currentEntryId: string | null;
  //currentLibraryIndex: number | null
};

