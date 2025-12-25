// parseKif.ts
import type { KifData, Board, Hands, Move } from "../../types";
import { createBoard, createEmptyHand } from "../../types";
import { parseMoveLine } from "./kifParseMoveLine";
import type { PieceTypeKey } from "../../types/pieceType";


export function parseKif(text: string): KifData  {
  const lines = text.split(/\r?\n/);

  const hands = parseHands(lines)
  const board = parseBoard(lines) 
  const moves = parseMoves(lines) 

  return { board, hands, moves, title: "" } ;
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
    
    const move = parseMoveLine(line, prevTo)        
    if (!move) continue
    if ("type" in move) {
  
    break // 終局
  }
    prevTo = move?.position    
    moves.push(move);

  }
  console.log("parsed moves: ", moves)
  return moves
}
function parseBoard(lines: string[]): Board {
  const board: Board = createBoard()
  // 盤面開始位置
  const startIndex = lines.findIndex((l) =>
    l.includes("+---------------------------+")
  );
    
  for (let r = 0; r < 9; r++) {
    const line = lines[startIndex + 1 + r];
    if (!line) continue;

    
    // "| ◯◯◯… |一" の中央部を取り出す
    const inside = line.split("|")[1] ?? "";
    const rowStr = inside; // 例: " ・ ・ ・ 龍 ・ ・v銀v桂v香"

    // 1 セルは 2 文字で固定
    // rowStr は 18 文字以上あるので 0,2,4,...16 を取り出す
    for (let i = 0; i < 9; i++) {
      const cell = rowStr.substring(i * 2, i * 2 + 2); // 2文字

      let trimmed = cell.trim(); // "・", "金", "v銀" など

      if (!trimmed || trimmed === "・") {
        // 空マス
        continue;
      }

      // 後手駒（先頭が v）
      const isGote = trimmed.startsWith("v");
      const name = isGote ? trimmed.substring(1) : trimmed;

      // file は 9→1 を 0→8 に合わせて変換
      const file = 8 - i;
      const rank = r; // r=0 → 一段目

      //console.log("parsed:", file, rank, name, isGote ? "gote" : "sente")
      board[rank][file] = {
        key: name as PieceTypeKey,
        isBlack: !isGote,        
      };
    }
  }
  return board
}
export function parseHands(lines: string[]): Hands{
  let hands: Hands = { black: createEmptyHand(), white: createEmptyHand() };  
    for (const line of lines) {    
    // 先手の持駒
    if (line.startsWith("先手の持駒：")) {
      
      const value = line.replace("先手の持駒：", "").trim();
      //hands.black = value;        // ← ここに入れる // TODO
      continue;
    }

    // 後手の持駒
    if (line.startsWith("後手の持駒：")) {
      const value = line.replace("後手の持駒：", "").trim();
      //hands.white = value;        // ← 必要ならこちらも // TODO
      continue;
    }
  }
  return hands
}