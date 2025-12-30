import { useState, useMemo, useEffect } from 'react'
import type { Board, Hands, Move, KifEvent } from '../../types'
import { buildBoardUntil } from '../../domain/replay/boardBuilder'

export function useKifReplay(
    initialBoard: Board, 
    initialHands: Hands, 
    //events: KifEvent[],
    moves: Move[],
) {
    //console.log("moves in usekifreplay", moves)
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
    
    const { board, hands } = useMemo(() => 
        {
            return buildBoardUntil(initialBoard, initialHands, moves, currentMoveIndex)
        },
        [currentMoveIndex, initialBoard, initialHands, moves]
    );
    
    function reset(){
        setCurrentMoveIndex(0);
    }
    return {
        board, hands,
        currentMoveIndex, setCurrentMoveIndex,        
        retreatMove: () => {
            currentMoveIndex > 0 && setCurrentMoveIndex(prev => prev - 1)
        },
        advanceMove: () => {
           currentMoveIndex < moves.length && setCurrentMoveIndex(prev => prev + 1)
        },
        reset
    }
}