import { useState, useEffect, useRef, useMemo } from "react"
import { TextField, IconButton, Typography } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button} from "@mui/material"
import CheckIcon from '@mui/icons-material/Check'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'

import EditIcon from '@mui/icons-material/Edit';

//import { useKif } from '../hooks/useKif'
import { useNavigate } from "react-router-dom"
import type { KifEntry } from "../types/kifEntry";
import { useKif } from '../hooks/useKif'

type Props = {
  open: boolean
  //entryId: string | null
  //entry: KifEntry,
  entryId: string,
  onUpdateTitle: (title: string) => void;
  onConfirm: (entry: KifEntry) => void;
  onClose: () => void
  onDelete: () => void
}

export function KifEntryEditDialog({
  open,
  entryId,
  //entry,
  onUpdateTitle,
  onConfirm,
  onClose,
  onDelete,
}: Props) {
  //const { kifLibrary, kifLearning } = useKif()
  //const { findById, updateTitle, deleteEntry } = kifLibrary
  //const { getRecord } = kifLearning

  //const entry = entryId ? findById(entryId) : null
  //const record = entryId ? getRecord(entryId) : null
  const [title, setTitle] = useState("")
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const entries = useKif().kifEntryController.entries
  const entry = useMemo(
    () => entries.find(e => e.id === entryId),
    [entries, entryId]
  );
  // initialize
  // entry 切り替え時に title を同期
  useEffect(() => {
    setTitle(entry?.kifData.title ?? "")
  }, [entry])
  
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
  if (editing) {
    inputRef.current?.focus()
    //inputRef.current?.select() // ついでに全選択（おすすめ）
  }
}, [editing])

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
    onClose()
    setEditing(false);
    entry && onConfirm(entry);
    navigate("/player")
  }
  const handleCancel = () => {
    setEditing(false);
    onClose()
  }
  const handleResetAccuracy = () => {
    if (entry && window.confirm("本当に正答データをリセットしますか？")){
        //kifLearning.reset(entry.id)
    }
  }
  const handleSetTitle = () => {
    entry && onUpdateTitle(title.trim())
  }
    const handleEdit = () => {
    setDraft(title); // 現在のタイトルで初期化
    setEditing(true);
  };
  const handleEditFinish = () => {
    setEditing(false)
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl">
      <DialogTitle>
        棋譜エントリの詳細
      </DialogTitle>
      <DialogContent>
        
        {/* タイトル編集 */}
        <Box display="flex"  alignItems="center" gap={2} mt={1}>
          { editing ? 
            <>
              <TextField
                label="タイトル"
                fullWidth
                value={title}
                inputRef={inputRef}
                onChange={(e: any) => setTitle(e.target.value)}
              />
              <IconButton onClick={handleSetTitle}>
                <DoneIcon />
              </IconButton>
              <IconButton onClick={handleEditFinish}>
                <CloseIcon />
              </IconButton>

            </>
            : (<>
              <Typography flexGrow={1}>{title}</Typography>

              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </>)
          }

        </Box>
        <Box>
          登録日：{ (entry != null) ? new Date(entry.createdAt).toLocaleString("ja-JP") : "-" }
        </Box>
        <Box>
          UUID: { entryId.slice(0, 5)}...
        </Box>
        { /* 正答誤答*/ }
        <div>
         {/*  { record && `正答：${record.solvedCount}, 誤答：${record.failedCount}` }*/}
        
        <Button onClick= {handleResetAccuracy}>
          リセット
        </Button>
        </div>

      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleDelete}>
          削除
        </Button>
        <Button onClick={handleConfirm}>棋譜を表示</Button>
        <Button onClick={handleCancel}>キャンセル</Button>
        
      </DialogActions>
    </Dialog>
  )

}
