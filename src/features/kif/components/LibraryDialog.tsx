import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState, useEffect } from 'react'
import { Box, List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import type { KifLibraryEntry } from "../types/kif";
import FileButton from "../../../shared/components/FileButton";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

export interface LibraryDialogProps {
    open: boolean;
    onClose: () => void

    library: KifLibraryEntry[];
    importFile: (file: File) => Promise<KifLibraryEntry>;
    onSelect: (entry: KifLibraryEntry) => void;
    deleteEntry: (entry: KifLibraryEntry) => void;
    deleteEntries: (entries: KifLibraryEntry[]) => void;
}

export function LibraryDialog({
    open,
    onClose,
    library,
    importFile,
    onSelect,
    deleteEntry,
    deleteEntries,
}: LibraryDialogProps) {

    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

    const handleSelectFile = async (file: File) => {
        try {
            // importFile が完了するのを待つ
            const newEntry = await importFile(file);

            // 新しいライブラリの最後のインデックスを選択
            const index = library.findIndex(e => e.id === newEntry.id);
            if (index !== -1) {
                onSelect(newEntry);
            }
        } catch (err) {
            console.error("ファイルのインポートに失敗しました", err);
        }
    };

    const handleCheckboxChange = (id: string) => {
        setCheckedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };
    const handleDeleteSelected = async () => {
        if (checkedIds.size === 0) return;

        const ok = window.confirm(
            `選択された ${checkedIds.size} 件を削除しますか？`
        );
        if (!ok) return;

        // id → entry を一括変換
        const entriesToDelete = library.filter(e => checkedIds.has(e.id));

        if (entriesToDelete.length === 0) {
            setCheckedIds(new Set());
            return;
        }
        //console.log("entries to delete", entriesToDelete)

        await deleteEntries(entriesToDelete);

        setCheckedIds(new Set());
    };

    
    useEffect(() => {
        if (!open) setCheckedIds(new Set());
    }, [open]);
    

    const isMobile = window.innerWidth < 768;
    /////////////////////////////////////////////////////
    return (

        <Dialog
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullScreen={isMobile}
            fullWidth={!isMobile}>

            <DialogTitle>
                Library
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100dvh", // 好きな高さに調整
                }}
            >
                <Box sx={{ display: "flex", flexShrink: 0 }}>
                    {/* 全選択 */}
                    <Tooltip title="全選択">
                        <IconButton
                            onClick={() => setCheckedIds(new Set(library.map((e) => e.id)))}
                            color="primary"
                        >
                            <CheckBoxIcon />
                        </IconButton>
                    </Tooltip>

                    {/* 全解除 */}
                    <Tooltip title="全解除">
                        <IconButton
                            onClick={() => setCheckedIds(new Set())}
                            color="primary"
                        >
                            <CheckBoxOutlineBlankIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="選択した棋譜を削除">
                        <IconButton onClick={handleDeleteSelected} disabled={checkedIds.size === 0} color="error">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <List sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto"
                }}>
                    {library.map((entry, i) => (
                        <ListItem key={entry.id}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={checkedIds.has(entry.id)}
                                    onChange={(e) => {
                                        e.stopPropagation(); // ListItem のクリックイベントを防ぐ
                                        handleCheckboxChange(entry.id);
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText
                                sx={{
                                    cursor: "pointer",
                                    transition: "background-color 0.2s", // 背景色変化を滑らかに
                                    "&:hover": {
                                        backgroundColor: "#e0e0e0", // ホバー時の背景色
                                    },
                                }}
                                onClick={() => {
                                    console.log("list on select: entry", entry)
                                    onSelect(entry)
                                    onClose()
                                }
                                }>

                                {i + 1}: {entry.kifData.title} ({new Date(entry.createdAt).toLocaleString("ja-JP")})
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions
                sx={{
                    flexShrink: 0,
                    paddingBottom: "env(safe-area-inset-bottom)", // iOS/Androidの安全領域対応
                    px: 2, // 左右パディング
                    pt: 1, // 上パディング
                }}
            >
                <FileButton label="棋譜ファイルを登録" onFileSelected={handleSelectFile} />
                <button onClick={onClose}>戻る</button>
            </DialogActions>
        </Dialog>

    )
}
