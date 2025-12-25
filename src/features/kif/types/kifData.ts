import type { PieceTypeKey } from "./pieceType";
import { PieceTypes } from './pieceType'

export type Piece = {
  //name: string;
  key: PieceTypeKey;
  //isBlack: boolean;
  owner: PlayerType;
};

export type Board = (Piece | null)[][];

export type PlayerType = "black" | "white"

export type Hands = {
  black: Hand; // "金二 銀" のような文字列
  white: Hand;
};

export type Hand = Record<HandPieceKey, number>

//export type HandNew = Record<PlayerType, Record<HandPieceKey, number>>;
/*export type HandPieceKeyAuto = {
  [K in PieceTypeKey]:
    typeof PieceTypes[K] extends { promoted: false }
      ? K
      : never
}[PieceTypeKey];*/
export type HandPieceKey = "歩" | "香" | "桂" | "銀" | "金" | "角" | "飛"


export type Move = {
  moveNumber: number;
  moveText: string;
  piece: Piece;
  //isBlack: boolean;
  player: PlayerType;
  from: Position | null;
  position: Position;
  drop: boolean;
}

export type Position = {
  file: number;
  rank: number;
}

export type KifData = {
  board: Board;
  hands: Hands;
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

