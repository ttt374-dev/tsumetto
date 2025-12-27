// features/kif/hooks/useLibrarySort.ts
import { useState, useCallback } from "react"
import type { SortKey, SortOrder, SortState } from "../../types"

const DEFAULT_SORT: SortState = {
  key: "createdAt",
  order: "asc",
}

export function useKifLibrarySort() {
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT)

  const setSortKey = useCallback((key: SortKey) => {
    //alert("setsortkey")
    setSort(prev => {
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
    setSort(prev => ({ ...prev, order }))
  }, [])

  return {
    sort,          // { key, order }
    setSortKey,    // UI用
    setSortOrder,  // UI用（必要なら）
  }
}
