import { useState } from "react";

export function useKifLibraryUI() {
    const [entryToEditId, setEntryToEditId] = useState<string | null>(null)
    const [editMode, setEditMode] = useState(false)
    const toggleEditMode = () => {
        setEditMode(prev => !prev)
    }
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [backupOpen, setBackupOpen] = useState(false)


    return {
        entryToEditId,
        setEntryToEditId,
        openEditDialog,
        setOpenEditDialog,

        editMode,
        setEditMode,
        toggleEditMode,

        backupOpen,
        setBackupOpen,
    };
}
