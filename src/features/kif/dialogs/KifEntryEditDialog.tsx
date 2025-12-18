import { Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import { useKif } from '../hooks/useKif'
import { formatAccuracy } from "../utils/formatAccuracy"
import { Navigate, useNavigate } from "react-router-dom"

type Props = {
  open: boolean
  entryId: string | null
  onClose: () => void
  onDelete: () => void
}

export function KifEntryEditDialog({
  open,
  entryId,
  onClose,
  onDelete,
}: Props) {
  const { kifLibrary, kifLearning } = useKif()
  const { findById, updateTitle, deleteEntry } = kifLibrary
  const { getRecord } = kifLearning

  const entry = entryId ? findById(entryId) : null
  const record = entryId ? getRecord(entryId) : null
  const [title, setTitle] = useState("")

  // initialize
  // entry 切り替え時に title を同期
  useEffect(() => {
    setTitle(entry?.kifData.title ?? "")
  }, [entryId, entry])
  
  // handlers
  const handleDelete = () => {
    if (entry && window.confirm("本当に削除しますか？")){
      //deleteEntry(entry)      
      onDelete()
      onClose()
    }

   }
  const navigate = useNavigate()
  const handleConfirm = () => {
    if (entry && title.trim()) {
      updateTitle(entry.id, title.trim())

    }
    onClose()
    navigate("/player")
  }
  const handleCancel = () => {
    onClose()
  }
  const handleResetAccuracy = () => {
    entry && kifLearning.reset(entry.id)
  }
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        棋譜エントリの編集
      </DialogTitle>
      <DialogContent>
        
        {/* タイトル編集 */}
        <Box display="flex" gap={2} mt={1}>
          <TextField
            label="タイトル"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
           
          />
        </Box>
        { /* 正答誤答*/ }
        <div>
          { record && `正答：${record.solvedCount}, 誤答：${record.failedCount}` }
        
        <Button onClick= {handleResetAccuracy}>
          リセット
        </Button>
        </div>

      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleDelete}>
          削除
        </Button>
        <Button onClick={handleConfirm}>OK</Button>
        <Button onClick={handleCancel}>キャンセル</Button>
        
      </DialogActions>
    </Dialog>
  )

}
