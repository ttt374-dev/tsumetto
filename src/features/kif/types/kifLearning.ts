

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

