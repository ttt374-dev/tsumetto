
export type AnswerStat = {
    entryId: string; 
    correct: number        // 正解回数
    wrong: number          // 不正解回数
}

export type KifLearningRecord = {
    entryId: string;
    solvedCount: number;
    failedCount: number;
    lastAnsweredAt?: number;
}

export type KifLearningStore = {
  version: 1;
  records: Record<string, KifLearningRecord>;
};

