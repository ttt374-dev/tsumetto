
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";
import { Stack, Box, IconButton, Tooltip, Button } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import type { KifEntry } from "../../types"

type Props = {
  checkedIds: Set<string>
  entries: KifEntry[]
  onDelete: (entries: KifEntry[]) => Promise<void>
  onAfterDelete?: () => void
}

export default function LibraryDeleteControl({
  checkedIds,
  entries,
  onDelete,
  onAfterDelete,
}: Props) {

  const handleDelete = async () => {
    if (checkedIds.size === 0) return

    const ok = window.confirm(
      `選択された ${checkedIds.size} 件を削除しますか？`
    )
    if (!ok) return

    const targets = entries.filter(e => checkedIds.has(e.id))
    if (targets.length === 0) {
      onAfterDelete?.()
      return
    }

    await onDelete(targets)
    onAfterDelete?.()
  }

  return (
    <IconButton
      onClick={handleDelete}
      disabled={checkedIds.size === 0}
      color="error"
    >
      <DeleteIcon />
    </IconButton>
  )
}
