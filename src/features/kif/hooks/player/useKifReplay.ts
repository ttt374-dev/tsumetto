import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move} from '../../types'
import { buildBoardUntil } from '../../domain/replay/applyMove'

export function useKifReplay(
    initialBoard: Board, 
    initialHands: Hands, 
    moves: Move[],
    currentEntryId: string | null,
) {
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const { board, hands } = useMemo(() => 
        {
            console.error("build board on memo")
            return buildBoardUntil(initialBoard, initialHands, moves, currentIndex)
        },
        [currentIndex, initialBoard, initialHands, moves]
    );
    // ⭐ entry 切り替え時のリセット
    useEffect(() => {
        setCurrentIndex(0);
    }, [currentEntryId]);

    
    return {
        board, hands,
        currentIndex, setCurrentIndex,        
    }
}