// features/kif/hooks/useSortedEntries.ts
import { useMemo } from "react"
import type { KifEntry, KifLearningRecord, SortState } from "../../types/"



export function useKifSortedEntries(
  entities: KifEntry[],
  learningRecords: Record<string, KifLearningRecord>,
  sort: SortState
): KifEntry[] {

  console.log("sorted entries:", entities, sort)
  

    const calcAccuracy = (
        record: KifLearningRecord | undefined
    ): number | null => {
        if (!record) return null;

        const total = record.solvedCount + record.failedCount;
        if (total === 0) return null;

        return record.solvedCount / total;
    };


  return useMemo(() => {
    if (!entities || entities.length === 0) return []

    const sorted = [...entities]


    sorted.sort((a, b) => {
      let vA: any
      let vB: any

      switch (sort.key) {
        case "title":
          vA = a.kifData.title ?? ""
          vB = b.kifData.title ?? ""
          break

        case "createdAt":
          vA = a.createdAt
          vB = b.createdAt
          break

        case "accuracy":
          vA = calcAccuracy(learningRecords[a.id])
          vB = calcAccuracy(learningRecords[b.id])
          break

        default:
          return 0
      }

      if (vA < vB) return sort.order === "asc" ? -1 : 1
      if (vA > vB) return sort.order === "asc" ? 1 : -1
      return 0
    })

    console.log("sorted:", sorted)

    return sorted
  }, [entities, sort.key, sort.order])
}
