import type { PieceTypeKey } from "./pieceType";

export type Piece = {
  //name: string;
  key: PieceTypeKey;
  isBlack: boolean;
};

export type Board = (Piece | null)[][];

export type Hand = {
  black: string; // "金二 銀" のような文字列
  white: string;
};

export type Move = {
  moveNumber: number;
  moveText: string;
  piece: Piece;
  isBlack: boolean;
  from: string | null;
  position: Position;
  drop: boolean;
}

export type Position = {
  file: number;
  rank: number;
}

export type KifData = {
  board: Board;
  hands: Hand;
  moves: Move[];

  title: string;
  source?: string;  
}

export type KifEvent = Move | GameEnd

export type GameEnd = 
  | { type: "resign" }     // 投了
  | { type: "timeup" }     // 切れ負け
  | { type: "illegal" }    // 反則
  | { type: "draw" }  

//////////////////
// 初期化関数
export const createBoard = (): Board =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );


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
