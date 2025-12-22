import { useMemo } from "react"

import type { KifEntry, KifEntryWithLearning } from '../types/kifEntity'
import type { KifLearningRecord } from "../types/kifLearning"
import type { SortKey, SortOrder } from '../types/kifEntity'

export function useKifSortedLibraryWithLearning(
  library: KifEntry[],
  records: Record<string, KifLearningRecord>,
  sortKey: SortKey,
  sortOrder: SortOrder
) {
  const viewEntries = useMemo<KifEntryWithLearning[]>(() => {
    return library.map(entry => {
      const r = records[entry.id]
      const solved = r?.solvedCount ?? 0
      const failed = r?.failedCount ?? 0
      const total = solved + failed

      return {
        ...entry, // ← flatten
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

export function compareKifLibraryWithLearning(
  a: KifEntryWithLearning,
  b: KifEntryWithLearning,
  sortKey: SortKey
) {
  switch (sortKey) {
    case "createdAt":
      return a.createdAt - b.createdAt

    case "title":
      return a.kifData.title.localeCompare(b.kifData.title)

    case "moveCount":
      return a.kifData.moves.length - b.kifData.moves.length

    case "accuracy": {
      // 未学習は最後に寄せる
      if (a.accuracy == null && b.accuracy == null) return 0
      if (a.accuracy == null) return 1
      if (b.accuracy == null) return -1
      return a.accuracy - b.accuracy
    }
  }
}
