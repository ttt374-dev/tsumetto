import type { Board, Hands } from "./kifData";
import type { KifEvent } from "./kifData";

export type KifProblem = {
    id: string | null;
    title: string;
    initialBoard: Board;
    initialHands: Hands;
    events: KifEvent[];

    solvedCounter: number
    failedCounter: number
    lastAnsweredAt: number // 最後に解答した日付
}