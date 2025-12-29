import { useState, useCallback } from "react"
import type { PlayerSession, QueueItem } from "../../types"
import { v4 } from "uuid"

// types/player.ts

export function usePlayerSession() {
    const [session, setSession] = useState<PlayerSession | null>(null)


    const startSession = (queue: QueueItem[]) => {
        if (queue.length === 0) return

        setSession({
            //sessionId: v4(),
            queue: queue,
            currentIndex: 0,
            //startedAt: Date.now(),
        })
    }
    const advance = useCallback(() => {
        setSession(prev => {
            if (!prev) return prev

            const nextIndex = prev.currentIndex + 1
            if (nextIndex >= prev.queue.length) {
                return {
                    ...prev,
                    currentIndex: prev.queue.length, // finished 状態
                }
            }

            return {
                ...prev,
                currentIndex: nextIndex,
            }
        })
        const reset = useCallback(() => {
            setSession(null)
        }, [])
    }, [])
    const currentProblemId =
        session && session.currentIndex < session.queue.length
            ? session.queue[session.currentIndex]
            : null

    const isFinished =
        !!session && session.currentIndex >= session.queue.length

    return {
        session, setSession, startSession, advance,
    }
}