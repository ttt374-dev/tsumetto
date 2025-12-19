import type { KifLibraryEntry } from "./kifLibrary"
import type { KifLearningRecord } from "./kifLearning"

export type KifBackupV1 = {
  version: 1
  exportedAt: number

  library: KifLibraryEntry[]
  learning: Record<string, KifLearningRecord>
}
