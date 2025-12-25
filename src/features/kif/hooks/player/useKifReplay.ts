import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move, Position, HandPieceKey} from '../../types'
import { applyMove } from '../../domain/applyMove'

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