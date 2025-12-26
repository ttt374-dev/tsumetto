import type { KifLearningRecord } from "../types";

// features/kif/utils/formatAccuracy.ts
export function formatAccuracy(
  accuracy: number | null,
  digits = 0
): string {
  if (accuracy == null) return "-"
  return `${(accuracy * 100).toFixed(digits)}%`
}


export const calcAccuracy = (
  record: KifLearningRecord | undefined
): number | null => {
  if (!record) return null;

  const total = record.solvedCount + record.failedCount;
  if (total === 0) return null;

  return record.solvedCount / total;
};