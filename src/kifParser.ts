// parseKif.ts
import { type Board, type Hand, type Move } from "./types";

export function parseKif(text: string): { board: Board, hands: Hand, moves: Move[] }  {
  let hands: Hand = { black: "", white: "" };  
  const moves: Move[] = [];

  // 9x9 null 埋め
  const board: Board = Array.from({ length: 9 }, () =>
    Array(9).fill(null)
  );

  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    console.log(line)
    // 先手の持駒
    if (line.startsWith("先手の持駒：")) {
      
      const value = line.replace("先手の持駒：", "").trim();
      hands.black = value;        // ← ここに入れる
      continue;
    }

    // 後手の持駒
    if (line.startsWith("後手の持駒：")) {
      const value = line.replace("後手の持駒：", "").trim();
      hands.white = value;        // ← 必要ならこちらも
      continue;
    }
  }

  // 盤面開始位置
  const startIndex = lines.findIndex((l) =>
    l.includes("+---------------------------+")
  );
  
  if (startIndex === -1) return { board, hands, moves } ;

  // 以降の9行が盤面
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

      console.log("parsed:", file, rank, name, isGote ? "gote" : "sente")
      board[rank][file] = {
        name,
        isBlack: !isGote,
      };
    }
  }

   // -----------------------------
  // 指し手（moves）解析
  // -----------------------------
  

  let inMoves = false;

  for (const line of lines) {
    if (line.startsWith("手数")) {
      inMoves = true;
      continue;
    }
    if (!inMoves) continue;
    console.log("in moves: ", line)
    const move = { moveNumber: 0, rawText: line}
    /*
    // 行例: "   1 ５二金打     ( 0:00/00:00:00)"
    const m = line.match(/^\s*(\d+)\s+([\d一二三四五六七八九]+.*?)/);
    if (!m) continue;

    const move = {
      moveNumber: Number(m[1]),
      rawText: m[2].trim(),
    }
      */
    moves.push(move);
    console.log("moves: ", move.moveNumber, move.rawText)
  }

  return { board, hands, moves } ;
}
