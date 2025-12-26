import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move, KifEvent } from '../../types'
import { buildBoardUntil } from '../../domain/replay/applyMove'

export function useKifReplay(
    initialBoard: Board, 
    initialHands: Hands, 
    events: KifEvent[],
    currentEntryId: string | null,
) {
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const { board, hands } = useMemo(() => 
        {
            console.log("build board on memo")
            return buildBoardUntil(initialBoard, initialHands, events, currentIndex)
        },
        [currentIndex, initialBoard, initialHands, events]
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