import type { Move } from '../types/kif'

// 1行の KIF を解析して Move オブジェクトへ
export function parseMoveLine(line: string): Move | null {
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
