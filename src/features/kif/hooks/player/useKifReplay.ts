import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move, KifEvent } from '../../types'
import { buildBoardUntil } from '../../domain/replay/applyMove'

export function useKifReplay(
    initialBoard: Board, 
    initialHands: Hands, 
    events: KifEvent[],
) {
    const [currentEventIndex, setCurrentEventIndex] = useState(0)
    
    const { board, hands } = useMemo(() => 
        {
            console.log("build board on memo")
            return buildBoardUntil(initialBoard, initialHands, events, currentEventIndex)
        },
        [currentEventIndex, initialBoard, initialHands, events]
    );
    
    function reset(){
        setCurrentEventIndex(0);
    }
    return {
        board, hands,
        currentEventIndex, setCurrentEventIndex,        
        retreatEvent: () => {
            currentEventIndex > 0 && setCurrentEventIndex(prev => prev - 1)
        },
        advanceEvent: () => {
           currentEventIndex < events.length && setCurrentEventIndex(prev => prev + 1)
        },
        reset
    }
}