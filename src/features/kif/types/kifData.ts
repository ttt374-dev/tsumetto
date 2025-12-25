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

export function createEmptyHand(): Record<HandPieceKey, number> {
  const hand = {} as Record<HandPieceKey, number>;

  for (const [key, def] of Object.entries(PieceTypes)) {
    if (!def.promoted) {
      hand[key as HandPieceKey] = 0;
    }
  }

  return hand;
}

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

//////////////////
// 初期化関数
export const createEmptyBoard = (): Board =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => null)
  );


export function createKifData(
  partial?: Partial<KifData>
): KifData {
  return {
    board: createEmptyBoard(),
    hands: { black: createEmptyHand(), white: createEmptyHand() },
    //hands: { black: createEmptyHand(), white: createEmptyHand()},
    moves: [],
    title: "",
    //createdAt: Date.now(),
    ...partial,
  };
}
