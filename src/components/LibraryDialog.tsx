import { Dialog } from "@mui/material";
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import type { KifLibraryEntry } from "../types";
import FileButton from "../components/FileButton";
import { AppLayout } from '../components/AppLayout';

export interface LibraryDialogProps {
    library: KifLibraryEntry[];
    importFile: (file: File) => Promise<KifLibraryEntry>;
    onSelect: (index: number) => void;
    deleteEntry: (entry: KifLibraryEntry) => void;
}

export function LibraryDialog({
    open,
    onClose,
    library,
    importFile,
    onSelect,
    deleteEntry
}: LibraryDialogProps & { open: boolean; onClose: () => void }) {

    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());


    const handleSelectFile = (file: File) => {
        importFile(file)
        onSelect(library.length)
    }
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

        for (const id of checkedIds) {
            const entry = library.find((e) => e.id === id);
            if (entry) await deleteEntry(entry);
        }
        setCheckedIds(new Set());
    };

    /////////////////////////////////////////////////////
    return (
        
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen   // ← Android ならほぼ必須
        >
            <AppLayout
                header={<>
                    {/* 全選択 / 全解除 */}
                    <button
                        onClick={() => setCheckedIds(new Set(library.map((e) => e.id)))}
                    >
                        全選択
                    </button>
                    <button onClick={() => setCheckedIds(new Set())}>
                        全解除
                    </button>

                </>}
                footer={
                    <>
                        

                        <FileButton label="Import File" onFileSelected={handleSelectFile} />

                        <button onClick={handleDeleteSelected}>Delete Selected</button>
                        <button onClick={onClose}>Close</button>
                    </>
                }
            >
                <List style={{
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
                                    const index = library.indexOf(entry);
                                    //loadFromLibrary(index);
                                    onSelect(index)
                                    onClose()
                                }
                                }>

                                {i + 1}: {entry.title} ({new Date(entry.createdAt).toLocaleString("ja-JP")})
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </AppLayout>
        </Dialog>
    )
}