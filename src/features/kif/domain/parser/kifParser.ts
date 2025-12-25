// parseKif.ts
import type { KifData } from "../../types";
import { parseHands } from "./kifParseHand";
import { parseMoves } from "./kifParseMove";
import { parseBoard } from "./kifParseBoard";

export function parseKif(text: string): KifData  {
  const lines = text.split(/\r?\n/);

  const hands = parseHands(lines)
  const board = parseBoard(lines) 
  const moves = parseMoves(lines) 

  return { board, hands, moves, title: "" } ;
}

