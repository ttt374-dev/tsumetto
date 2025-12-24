import { useState, useMemo, useEffect } from 'react'
import type { Board, Hand, Move, Position} from '../../types'

export function useKifReplay(
    initialBoard: Board, 
    hands: Hand, 
    moves: Move[],
    currentEntryId: string | null,
) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(()=>{}
    , [])
    const board = useMemo(
        () => buildBoardUntil(currentIndex),
        [currentIndex, initialBoard, moves]
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

    function applyMove(board: Board, hands: Hand, move: Move) {
        const { x, y } = posToIndex(move.position)
        board[y][x] = move.piece
        
        if (move.from !== null){
            const { x: x2,  y: y2} = posToIndex(move.from)
            board[y2][x2] = null
        }
        //board[move.position.file][move.position.rank] = move.piece

    }
    function buildBoardUntil(index: number): Board {
        const board = cloneBoard(initialBoard);

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

    return {
        board,
        currentIndex, setCurrentIndex,
        applyMove,
        buildBoardUntil,
    }
}