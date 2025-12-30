import type { PieceTypeKey } from "./pieceType";

export type PlayerType = "black" | "white"

export type Piece = {
  key: PieceTypeKey;
  owner: PlayerType;
};

export type HandPieceKey = "飛" | "角" | "金" | "銀" | "桂" | "香" | "歩";

export type Position = {
  file: number;
  rank: number;
}

export type Board = (Piece | null)[][];

export type Hands = {
  black: Hand; // "金二 銀" のような文字列
  white: Hand;
};

export type Hand = Record<HandPieceKey, number>
export type KifHeader = Record<string, string>

export type Move = {
  type: "move";
  moveNumber: number;
  moveText: string;
  piece: Piece;
  player: PlayerType;
  from: Position | null;
  position: Position;
  //to: Position,
  drop: boolean;
}

export type GameEndReason = "resign" | "timeup" | "illegal" | "draw"
export type GameStart = { type: "start" }
export type GameEnd = { 
  type: "end", 
  reason: GameEndReason,
  winner?: PlayerType,
  moveNumber?: number,
 }  
export type KifEvent = Move | GameStart | GameEnd

export type KifData = {
  board: Board;
  hands: Hands;
  //moves: Move[];
  events: KifEvent[]
  headers: KifHeader

  //title: string;
  //source?: string;  
}

export function isValidKifData(data: KifData): boolean {
  // ヘッダも空、eventsも空なら無効
  const hasHeader = Object.keys(data.headers).length > 0;
  const hasEvents = data.events.length > 0;

  return hasHeader || hasEvents;
}

export function getMoves(kifData: KifData): Move[] {
  return (kifData.events ?? []).filter((e): e is Move => e.type === "move");
}