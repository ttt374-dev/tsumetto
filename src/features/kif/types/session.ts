
export type QueueItem = {
  problemId: string
}
export type AnswerResult = "correct" | "wrong" | "skipped";
export type PlayerSession = {
    deckId: string
    sessionId: string
    queue: QueueItem[]
    currentIndex: number
    results: Record<string, AnswerResult>
    //startedAt: number
}


