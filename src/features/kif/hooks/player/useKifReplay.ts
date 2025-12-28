import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move, KifEvent } from '../../types'
import { buildBoardUntil } from '../../domain/replay/applyMove'

export function useKifReplay(
    initialBoard: Board, 
    initialHands: Hands, 
    events: KifEvent[],
    currentEntryId: string | null,
) {
    const [currentEventIndex, setCurrentEventIndex] = useState(0)
    
    const { board, hands } = useMemo(() => 
        {
            console.log("build board on memo")
            return buildBoardUntil(initialBoard, initialHands, events, currentEventIndex)
        },
        [currentEventIndex, initialBoard, initialHands, events]
    );
    // ⭐ entry 切り替え時のリセット
    useEffect(() => {
        setCurrentEventIndex(0);
    }, [currentEntryId]);

    
    return {
        board, hands,
        currentEventIndex, setCurrentEventIndex,        
        movePrevEvent: () => {
            currentEventIndex > 0 && setCurrentEventIndex(prev => prev - 1)
        },
        moveNextEvent: () => {
           currentEventIndex < events.length && setCurrentEventIndex(prev => prev + 1)
        }
    }
}