import type { KifLearningRecord } from "../../types"
import { formatDate } from "../../../../shared/utils"

type AnswerQuality = 0 | 1 | 2 | 3

export function scheduleNext(
  record: KifLearningRecord,
  quality: number,
  now: number
): KifLearningRecord {
  let { intervalDays, easeFactor } = record

  if (!intervalDays) intervalDays = 0
  if (!easeFactor) easeFactor = 2.5
  if (quality < 2) {
    // 不正解
    intervalDays = 1
  } else {
    if (intervalDays === 0) intervalDays = 1
    else if (intervalDays === 1) intervalDays = 3
    else intervalDays = Math.round(intervalDays * easeFactor)
  }

  // easeFactor 更新
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02))
  )

  const nextReviewedAt =
    now + intervalDays * 24 * 60 * 60 * 1000

  console.log("scheule next", quality, intervalDays, formatDate(nextReviewedAt), easeFactor)
  return {
    ...record,
    intervalDays,
    easeFactor,
    lastAnsweredAt: now,
    nextReviewedAt,
  }
}
