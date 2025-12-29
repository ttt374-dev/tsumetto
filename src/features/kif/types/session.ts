

export type QueueItem = {
  problemId: string
}

export type PlayerSession = {
    deckId: string
    sessionId: string
    queue: QueueItem[]
    currentIndex: number
    //startedAt: number
}


