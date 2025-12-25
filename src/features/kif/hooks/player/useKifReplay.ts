import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move, Position, HandPieceKey} from '../../types'

export function useKifReplay(
    initialBoard: Board, 
    initialHands: Hands, 
    moves: Move[],
    currentEntryId: string | null,
) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(()=>{}
    , [])
    const board = useMemo(
        () => buildBoardUntil(currentIndex),
        [currentIndex, initialBoard, initialHands, moves]
    );
    // ⭐ entry 切り替え時のリセット
    useEffect(() => {
        setCurrentIndex(0);
    }, [currentEntryId]);



    function posToIndex(pos: Position) {
        return {
            x: pos.file - 1,
            y: pos.rank - 1,
        }
    }

    function applyMove(board: Board, hands: Hands, move: Move) {
        const { x, y } = posToIndex(move.position)
        board[y][x] = move.piece
        
        if (move.from !== null){
            const { x: x2,  y: y2} = posToIndex(move.from)
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
    function buildBoardUntil(index: number): Board {
        const board = cloneBoard(initialBoard);
        const hands = cloneHands(initialHands)

        for (let i = 0; i < index; i++) {
            applyMove(board, hands, moves[i]);
        }

        return board;
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

    return {
        board,
        currentIndex, setCurrentIndex,
        applyMove,
        buildBoardUntil,
    }
}