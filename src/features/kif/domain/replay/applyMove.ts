import type { Board, Hands, Move, HandPieceKey, Position, PieceTypeKey } from '../../types'
import { PieceTypes } from '../../types'

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
    
    console.error("apply move")
    const cell = board[y][x]
    console.log("apply move", move, cell)
    // 相手の駒を取る
    if (cell !== null){
        const key = getBasePieceKey(cell.key) as HandPieceKey
        console.log("相手の駒を取る", move, key)
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

export type ReplayState = {
  board: Board;
  hands: Hands;
};
export function buildBoardUntil(
         initialBoard: Board, 
        initialHands: Hands, 
        moves: Move[],
        index: number): ReplayState {
        const board = cloneBoard(initialBoard);
        const hands = cloneHands(initialHands)
        
        console.log("build board ")
        for (let i = 0; i < index; i++) {
            applyMove(board, hands, moves[i]);
        }

        return { board, hands }
    }
    function cloneBoard(board: Board): Board {
        return board.map(row =>
            row.map(cell => (cell ? { ...cell } : null))
        );
    }
    function cloneHands(hands: Hands): Hands {
        return {
            black: { ...hands.black },
            white: { ...hands.white },
        };
    }
