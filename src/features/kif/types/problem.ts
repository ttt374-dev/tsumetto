import type { Board, Hands, Move, KifEvent, KifData } from "./kifData"
import type { KifEntry } from "./kifEntry"

export type Problem = KifEntry
export type KifContent = KifData

/*
export type Problem = {
    id: string
    title: string
    headers: string[]    
    createdAt: number,
    kifContent: KifData,
}

export type KifContent = {
    initialBoard: Board,
    initialHands: Hands,
    events: KifEvent[]

}
    */