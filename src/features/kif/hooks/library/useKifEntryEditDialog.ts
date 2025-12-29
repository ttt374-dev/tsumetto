import { useState } from 'react'

export function useKifEntryEditDialog() {
  const [open, setOpen] = useState(false)
  const [entryId, setEntryId] = useState<string | null>(null)

  const openFor = (id: string) => {
    setEntryId(id)
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setEntryId(null)
  }

  return { open, entryId, openFor, close }
}
