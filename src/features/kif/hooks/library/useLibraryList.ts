import { useState, useCallback } from 'react'

import type { KifEntry } from '../../types'

export function useKifLibraryList(entries: KifEntry[]) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    () => new Set()
  )

  const isChecked = useCallback(
    (id: string) => checkedIds.has(id),
    [checkedIds]
  )

  const toggleChecked = useCallback((id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const clearChecked = useCallback(() => {
    setCheckedIds(new Set())
  }, [])
  const selectAllChecked = () => setCheckedIds(new Set(entries.map((e: KifEntry) => e.id)));

  return {
    checkedIds,
    isChecked,
    toggleChecked,
    clearChecked,
    selectAllChecked,
  }
}
