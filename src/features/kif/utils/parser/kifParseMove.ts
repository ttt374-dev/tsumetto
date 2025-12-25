//import type { Move } from '../types/kif'

import type { Move, HandNew, Position, KifEvent, HandPieceKey, PlayerType } from '../../types'
import type { PieceTypeKey,  } from '../../types/pieceType';
import { parsePosition, parseFromToPosition } from './kifParsePosition';
import type { ParseResult } from './parseResult';

// 1行の KIF を解析して Move オブジェクトへ
export function parseMoveLine(line: string, prevPosition?: Position): ParseResult<KifEvent> {
  //console.log("parse move line", line, prevPosition)
  //  例: "  5 １六歩(43)    ( 0:00/00:00:00)"
  const moveRegex = /^\s*(\d+)\s+([^\(]+?)(?:\((\d\d)\))?\s*\(/;
  const m = line.match(moveRegex);
  if (!m) return { ok: false, error: { message: "no match"}};

  const moveNumber = parseInt(m[1], 10);
  const isBlack = moveNumber % 2 == 1
  const moveText = m[2].trim();  // "１六歩"
  //const from = m[3] || null;     // "43" 等、無ければ null
  const fromResult = parseFromToPosition(m[3])
  if (!fromResult.ok) return fromResult
  const from = fromResult.value

  if (moveText.startsWith("投了")){
    console.log("投了！")
    return { ok: true, value: { type: "resign"}}
  }
  const positionResult = parsePosition(moveText, prevPosition)
  if (!positionResult.ok){
    //throw new Error("invalid position: 同だが prevTo がない")
    return positionResult
  }
  const position = positionResult.value
  let drop = false  
  let baseMoveText = moveText
  if (moveText.endsWith("不成")){
    baseMoveText = moveText.slice(0, -2)
  }
  if (baseMoveText.endsWith("打")){
    drop = true
    baseMoveText = baseMoveText.slice(0, -1)
  } else if (["右", "左", "引", "直", "寄", "上"].some(s => baseMoveText.endsWith(s))){
    baseMoveText = baseMoveText.slice(0, -1)
  }
  const piece = {
    key: baseMoveText.slice(2) as PieceTypeKey, // TODO
    //name: moveText.charAt(2),
    isBlack: isBlack,
  }
  //const position = {file:1, rank: 1}
  
  
  console.log("parse move", moveNumber, isBlack, moveText, from, position, piece)
  return {ok: true, value: { moveNumber, isBlack, piece, moveText, from, position, drop }}
}

////////
export function parseMoves(lines: string[]): Move[] {
  const moves: Move[] = [];
  let prevTo = undefined
  let inMoves = false;

  for (const line of lines) {
    if (line.startsWith("手数")) {
      inMoves = true;
      continue;
    }
    if (!inMoves) continue;
    
    const moveResult = parseMoveLine(line, prevTo)        
    if (!moveResult.ok) continue
    //if (!move) continue
    const move = moveResult.value
    if ("type" in move) {
  
    break // 終局
  }
    prevTo = move?.position    
    moves.push(move);

  }
  console.log("parsed moves: ", moves)
  return moves
}
/*
// 1行の KIF を解析して Move オブジェクトへ
export function parseMoveLineOld(line: string): Move | null {
  //console.log("parse move", line)
  //  例: "  5 １六歩(43)    ( 0:00/00:00:00)"
  const moveRegex = /^\s*(\d+)\s+([^\(]+?)(?:\((\d\d)\))?\s*\(/;
  const m = line.match(moveRegex);
  if (!m) return null;

  const moveNumber = parseInt(m[1], 10);
  const isBlack = moveNumber % 2 == 1
  const moveText = m[2].trim();  // "１六歩"
  const from = m[3] || null;     // "43" 等、無ければ null
  
  
  //console.log("parse move", moveNumber, isBlack, moveText, from)
  return { moveNumber, isBlack, moveText, from };
}
*/