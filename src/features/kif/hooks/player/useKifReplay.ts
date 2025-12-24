import { useState, useMemo } from 'react'
import type { Board, Hand, Move, Position} from '../../types'

export function useKifReplay(initialBoard: Board, hands: Hand, moves: Move[]) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const board = useMemo(
        () => buildBoardUntil(currentIndex),
        [currentIndex]
    );


    function posToIndex(pos: Position) {
        return {
            x: pos.file - 1,
            y: pos.rank - 1,
        }
    }

    function applyMove(board: Board, hands: Hand, move: Move) {
        const { x, y } = posToIndex(move.position)
        board[y][x] = move.piece
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