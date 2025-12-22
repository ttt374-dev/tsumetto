// features/kif/hooks/useSortedEntries.ts
import { useMemo } from "react"
import type { KifEntry, SortState } from "../types/"



export function useKifSortedEntries(
  entities: KifEntry[],
  sort: SortState
): KifEntry[] {

  console.log("sorted entries:", entities, sort)

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

        default:
          return 0
      }

      if (vA < vB) return sort.order === "asc" ? -1 : 1
      if (vA > vB) return sort.order === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [entities, sort.key, sort.order])
}
