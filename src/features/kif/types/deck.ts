import type { Problem } from "./problem"
import type { QueueItem } from "./session"

export type Deck = {
    id: string,
    name: string,
    buildQueue: (problems: Problem[]) => QueueItem[]
}
