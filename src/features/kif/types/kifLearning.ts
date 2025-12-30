

export type KifLearningRecord = {
  entryId: string;
  solvedCount: number;
  failedCount: number;
  lastAnsweredAt?: number;

  intervalDays: number        // 次回までの日数
  nextReviewedAt: number        // 次に解くべき時刻（ms）
  easeFactor: number          // 習熟度（Anki系）
}

export type KifLearningStore = {
  version: 1;
  records: Record<string, KifLearningRecord>;
};

