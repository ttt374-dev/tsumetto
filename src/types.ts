export type Piece = {
  name: string;
  isBlack: boolean;
};

export type Board = (Piece | null)[][];

export const createEmptyBoard = (): Board =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );

export type Hand = {
  black: string; // "金二 銀" のような文字列
  white: string;
};

export type Move = {
  moveNumber: number;
  rawText: string;
}

export type KifData = {
  board: Board;
  hands: Hand;
  moves: Move[];  
}

export type KifPlaybackState = {
  source: "temp" | "library";
  playMode: "single" | "seq" | "random";
  kif?: KifData;
  title?: string;
};
