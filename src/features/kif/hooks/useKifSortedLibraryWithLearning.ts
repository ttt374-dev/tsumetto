import { useMemo } from "react"

import type { KifLibraryEntry, KifLibraryWithLearning } from '../types/kifLibrary'
import type { KifLearningRecord } from "../types/kifLearning"
import type { SortKey, SortOrder } from '../types/kifLibrary'

export function useKifSortedLibraryWithLearning(
  library: KifLibraryEntry[],
  records: Record<string, KifLearningRecord>,
  sortKey: SortKey,
  sortOrder: SortOrder
) {
  const viewEntries = useMemo<KifLibraryWithLearning[]>(() => {
    return library.map(entry => {
      const r = records[entry.id]
      const solved = r?.solvedCount ?? 0
      const failed = r?.failedCount ?? 0
      const total = solved + failed

      return {
        entry,
        solvedCount: solved,
        failedCount: failed,
        accuracy: total > 0 ? solved / total : null,
      }
    })
  }, [library, records])

  const sortedEntries = useMemo(() => {
    return [...viewEntries].sort((a, b) => {
      const cmp = compareKifLibraryWithLearning(a, b, sortKey)
      return sortOrder === "asc" ? cmp : -cmp
    })
  }, [viewEntries, sortKey, sortOrder])

  return sortedEntries
}
// hooks/compareKifLibraryWithLearning.ts
export function compareKifLibraryWithLearning(
  a: KifLibraryWithLearning,
  b: KifLibraryWithLearning,
  sortKey: SortKey
) {
  switch (sortKey) {
    case "createdAt":
      return a.entry.createdAt - b.entry.createdAt

    case "title":
      return a.entry.kifData.title.localeCompare(b.entry.kifData.title)

    case "moveCount":
      return a.entry.kifData.moves.length - b.entry.kifData.moves.length

    case "accuracy": {
      // 未学習は最後に寄せる
      if (a.accuracy == null && b.accuracy == null) return 0
      if (a.accuracy == null) return 1
      if (b.accuracy == null) return -1
      return a.accuracy - b.accuracy
    }
  }
}
