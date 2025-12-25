import type { Board, Hands, Move, HandPieceKey, Position, PieceTypeKey } from '../types'
import { PieceTypes } from '../types'

function posToIndex(pos: Position) {
    return {
        x: pos.file - 1,
        y: pos.rank - 1,
    }
}

export function getBasePieceKey(
  key: PieceTypeKey
): PieceTypeKey {
  const pieceType = PieceTypes[key];
  return pieceType.promoted
    ? ( pieceType.base ?? "")
    : key;
}


export function applyMove(board: Board, hands: Hands, move: Move) {
    const { x, y } = posToIndex(move.position)
    
    const cell = board[y][x]
    // 相手の駒を取る
    if (cell !== null){
        const key = getBasePieceKey(cell.key) as HandPieceKey
        hands.black[key]++
    }

    // 移動
    board[y][x] = move.piece
    if (move.from !== null) {
        const { x: x2, y: y2 } = posToIndex(move.from)
        board[y2][x2] = null
    }
    // 打つの場合の持ち駒
    if (move.drop) {
        const ownerHands = hands[move.player];
        const key = move.piece.key as HandPieceKey;

        if (ownerHands[key] <= 0) {
            throw new Error(`持ち駒がありません: ${key}`);
        }

        ownerHands[key] -= 1;
    }
    
    
    //board[move.position.file][move.position.rank] = move.piece

}

