// hooks/useKifLibrary.ts
import { useState, useEffect, useMemo } from "react";
import type { SortKey, SortOrder, KifLibraryEntry,  } from "../types/kifLibrary";
import type { KifLearningRecord } from '../types/kifLearning'


export function useSortedKifLibrary(
  library: KifLibraryEntry[],
  sortKey: SortKey,
  sortOrder: "asc" | "desc"
) {
  return useMemo(() => {
    return [...library].sort((a, b) => {
      let cmp = 0

      switch (sortKey) {
        case "createdAt":
          cmp = a.createdAt - b.createdAt
          break

        case "title":
          cmp = a.kifData.title.localeCompare(b.kifData.title)
          break

        case "moveCount":
          cmp = a.kifData.moves.length - b.kifData.moves.length
          break

        default:
          cmp = 0
      }

      return sortOrder === "asc" ? cmp : -cmp
    })
  }, [library, sortKey, sortOrder])
}
