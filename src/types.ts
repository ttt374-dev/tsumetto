export type Piece = {
  name: string;
  isBlack: boolean;
};

export type Board = (Piece | null)[][];

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