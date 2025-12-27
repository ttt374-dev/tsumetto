// parseKif.ts
import { isValidKifData, type KifData } from "../../types";
import { parseHands } from "./kifParseHand";
import { parseBoard } from "./kifParseBoard";
import { parseEvents } from "./kifParseEvent";
import { parseHeader } from "./kifParseHeader";
import type { ParseResult } from "./parseResult";
import { createDefaultBoard, createEmptyBoard } from "../factory";

export function parseKif(text: string): ParseResult<KifData>  {
  const lines = text.split(/\r?\n/);

  const headers = parseHeader(lines)
  const hands = parseHands(lines)
  const givenBoard = parseBoard(lines)   
  const events = parseEvents(lines)

  const board = (givenBoard ) ? givenBoard :
    ( headers['手合割'] === '平手' ? createDefaultBoard() : createEmptyBoard() )
  
  const kifData: KifData = { headers, board, hands, events } ;

  if (isValidKifData(kifData)){
    return { 
      ok: true, value: kifData
    }
  } else {
    return {
      ok: false, error: { message: "invalid kif data"}
    }
  }
}

