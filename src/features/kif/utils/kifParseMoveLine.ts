//import type { Move } from '../types/kif'

import type { Move, HandNew, Position, KifEvent, HandPieceKey, OwnerType } from '../types/'
import type { PieceTypeKey,  } from '../types/pieceType';


export const kanToNumber: Record<string, number> = {
  "一": 1,
  "二": 2,
  "三": 3,
  "四": 4,
  "五": 5,
  "六": 6,
  "七": 7,
  "八": 8,
  "九": 9,
};

function zenkakuToNumber(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code >= 0xFF10 && code <= 0xFF19) {
    return code - 0xFF10 + 0;
  }
  return parseInt(ch, 10);
}



////////////////////////////
// 同なら null　を返す
function parsePosition(moveStr: string): Position | null {
    console.log("parse position", moveStr)
  if (moveStr.length < 2) throw new Error(`invalid move: ${moveStr}`);

if (moveStr.startsWith("同"))
    return null
  const fileChar = moveStr[0];
  const rankChar = moveStr[1];

  const file = zenkakuToNumber(fileChar);
  const rank = kanToNumber[rankChar];

  
  //if (!file || !rank) throw new Error(`invalid move: ${moveStr}: ${file} ${rank}`);
  if (!file || !rank) console.error(`invalid move: ${moveStr}: ${file} ${rank}`);
  console.log("parsed: ", file, rank)
  return { file, rank };
}

function parseFromToPosition(from?: string | null): Position | null {
  if (!from) return null;          // 空・undefined・null
  if (from.length !== 2) return null;

  const file = Number(from[0]);
  const rank = Number(from[1]);

  if (!Number.isInteger(file) || !Number.isInteger(rank)) {
    return null;                   // 数字にできない
  }

  // 必要なら KIF の「打ち」
  if (file === 0 && rank === 0) {
    return null;
  }

  return { file, rank };
}

// 1行の KIF を解析して Move オブジェクトへ
export function parseMoveLine(line: string, prevPosition?: Position): KifEvent | null {
  console.log("parse move line", line, prevPosition)
  //  例: "  5 １六歩(43)    ( 0:00/00:00:00)"
  const moveRegex = /^\s*(\d+)\s+([^\(]+?)(?:\((\d\d)\))?\s*\(/;
  const m = line.match(moveRegex);
  if (!m) return null;

  const moveNumber = parseInt(m[1], 10);
  const isBlack = moveNumber % 2 == 1
  const moveText = m[2].trim();  // "１六歩"
  //const from = m[3] || null;     // "43" 等、無ければ null
  const from = parseFromToPosition(m[3]) || null

  if (moveText.startsWith("投了")){
    console.log("投了！")
    return { type: "resign"}
  }
  const position = parsePosition(moveText) ?? prevPosition
  if (!position){
    throw new Error("invalid position: 同だが prevTo がない")
  }
  let drop = false
  let moveTextWithoutDrop = moveText
  if (moveText.endsWith("打")){
    drop = true
    moveTextWithoutDrop = moveText.slice(0, -1)
  }
  const piece = {
    key: moveTextWithoutDrop.slice(2) as PieceTypeKey, // TODO
    //name: moveText.charAt(2),
    isBlack: isBlack,
  }
  //const position = {file:1, rank: 1}
  
  
  console.log("parse move", moveNumber, isBlack, moveText, from, position, piece)
  return { moveNumber, isBlack, piece, moveText, from, position, drop };
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