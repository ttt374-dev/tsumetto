import { useState, useCallback } from "react"
import type { PlayerSession, QueueItem } from "../../types"
import { v4 } from "uuid"

// types/player.ts

export function usePlayerSession() {
    const [session, setSession] = useState<PlayerSession | null>(null)


    const startSession = (deckId: string, queue: QueueItem[]) => {
        if (queue.length === 0) return

        setSession({
            deckId: deckId,
            sessionId: v4(),
            queue: queue,
            currentPlyIndex: 0,
            //startedAt: Date.now(),,
            results: {}
        })
    }
    const advance = useCallback(() => {
        setSession(prev => {
            if (!prev) return prev

            const nextIndex = prev.currentPlyIndex + 1
            if (nextIndex >= prev.queue.length) {
                return {
                    ...prev,
                    currentPlyIndex: prev.queue.length, // finished 状態
                }
            }
            return {
                ...prev,
                currentPlyIndex: nextIndex,
            }
        })
        
    }, [])
    const retreat = useCallback(() => {
        setSession(prev => {
            if (!prev) return prev

            if (prev.currentPlyIndex <= 0) {
                return prev
            }

            return {
                ...prev,
                currentPlyIndex: prev.currentPlyIndex - 1,
            }
        })
    }, [])    

    const reset = useCallback(() => {
            setSession(null)
        }, [])
    
    const currentProblemId =
        session && session.currentPlyIndex < session.queue.length
            ? session.queue[session.currentPlyIndex]
            : null

    const isFinished =
        !!session && session.currentPlyIndex >= session.queue.length
    
    const isLastIndex = 
        !!session && session.currentPlyIndex == session.queue.length - 1
    return {
        session, setSession, startSession, advance, retreat,
        currentProblemId, isFinished, isLastIndex,
    }
}