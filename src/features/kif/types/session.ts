

export type QueueItem = {
  problemId: string
}

export type PlayerSession = {
    //sessionId: string
    queue: QueueItem[]
    currentIndex: number
    //startedAt: number
}


