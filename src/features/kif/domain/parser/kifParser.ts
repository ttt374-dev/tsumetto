// parseKif.ts
import type { KifData } from "../../types";
import { parseHands } from "./kifParseHand";
import { parseBoard } from "./kifParseBoard";
import { parseEvents } from "./kifParseEvent";

export function parseKif(text: string): KifData  {
  const lines = text.split(/\r?\n/);

  const hands = parseHands(lines)
  const board = parseBoard(lines)   
  const events = parseEvents(lines)

  return { board, hands, events } ;
}

