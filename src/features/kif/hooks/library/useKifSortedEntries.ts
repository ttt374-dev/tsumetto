// features/kif/hooks/useSortedEntries.ts
import { useMemo } from "react"
import type { KifEntry, KifLearningRecord, SortState } from "../../types"
import { calcAccuracy, formatAccuracy } from "../../utils"


export function useKifSortedEntries(
  entities: KifEntry[],
  learningRecords: Record<string, KifLearningRecord>,
  sort: SortState
): KifEntry[] {

  //console.log("sorted entries:", entities, sort)
  return useMemo(() => {
    if (!entities || entities.length === 0) return []

    const sorted = [...entities]

    sorted.sort((a, b) => {
      let vA: any
      let vB: any

      switch (sort.key) {
        case "title":
          vA = a.title ?? ""
          vB = b.title ?? ""
          break

        case "createdAt":
          vA = a.createdAt
          vB = b.createdAt
          break

        case "accuracy":
          const aAcc = calcAccuracy(learningRecords[a.id]) ?? 0
          const bAcc = calcAccuracy(learningRecords[b.id]) ?? 0
          return sort.order === "asc" ? aAcc - bAcc : bAcc - aAcc
          break
        case "easeFactor":
          vA = learningRecords[a.id].easeFactor
          vB = learningRecords[b.id].easeFactor
          break

        case "nextReviewedAt":
          vA = learningRecords[a.id].nextReviewedAt
          vB = learningRecords[b.id].nextReviewedAt
          break;

        case "random":
          vA = Math.random();
          vB = Math.random();
          break;

        default:
          return 0
      }
      //console.log("compare", sort.key, vA, vB)

      if (vA < vB) return sort.order === "asc" ? -1 : 1
      if (vA > vB) return sort.order === "asc" ? 1 : -1
      return 0
    })
    //alert("sorted")

    //console.log("sorted:", sorted)

    return sorted
  }, [entities, sort, learningRecords])
}
