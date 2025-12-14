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

export type KifPlayerState = {
  kifData: KifData | null;
  //currentMoveIndex: number;
  showAnswer: boolean;
  title: string,
  //mode: "temp" | "library";
  //playMode: "single" | "seq" | "random";
  source?: string;
};

