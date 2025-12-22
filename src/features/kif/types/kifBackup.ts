import type { KifEntry } from "./kifEntity"
import type { KifLearningRecord } from "./kifLearning"

export type KifBackupV1 = {
  version: 1
  exportedAt: number

  library: KifEntry[]
  learning: Record<string, KifLearningRecord>
}
