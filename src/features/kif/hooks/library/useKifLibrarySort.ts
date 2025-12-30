// features/kif/hooks/useLibrarySort.ts
import { useState, useCallback } from "react"
import type { SortKey, SortOrder, SortState } from "../../types"

const DEFAULT_SORT: SortState = {
  key: "createdAt",
  order: "asc",
}

export function useKifLibrarySort() {
  const [sortState, setSortState] = useState<SortState>(DEFAULT_SORT)

  const setSortKey = useCallback((key: SortKey) => {
    //alert("setsortkey")
    console.log("sort key", key)
    setSortState(prev => {
      // 同じキーを押したら order を反転
      if (prev.key === key) {
        return {
          ...prev,
          order: prev.order === "asc" ? "desc" : "asc",
        }
      }
      // キー変更時は order をリセット
      return {
        key,
        order: "asc",
      }
    })
  }, [])

  const setSortOrder = useCallback((order: SortOrder) => {
    console.log("sort order", order)
    setSortState(prev => ({ ...prev, order }))
  }, [])

  return {
    sortState,          // { key, order }
    setSortKey,    // UI用
    setSortOrder,  // UI用（必要なら）
  }
}
