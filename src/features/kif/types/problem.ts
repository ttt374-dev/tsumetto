import type { Board, Hands, KifEvent, Move } from "./kifData"


export type Problem = {
    core: ProblemCore,
    meta: ProblemMeta,
}

type ProblemCore = KifContent

type ProblemMeta = {
    id: string
    title: string
    headers: string[]    
    createdAt: number,
}

type KifContent = {
    initialBoard: Board,
    initialHands: Hands,
    move: Move,

}