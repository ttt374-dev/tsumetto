
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import LibraryList from '../components/LibraryList'
import LibraryControls from '../components/LibraryControls';
import { useLibraryHandlers } from '../hooks/useLibraryHandlers'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';
import { useKifSortedLibraryWithLearning } from '../hooks/useKifSortedLibraryWithLearning';
import { KifEntryEditDialog } from "../dialogs/KifEntryEditDialog";
import type { KifLibraryEntry } from '../types/kifLibrary';
import { KifBackupDialog } from '../dialogs/KifBackupDialog';
import { Box, Button } from '@mui/material'

export default function LibraryScreen() {
    const { kifLibrary, kifPlayer, kifLearning } = useKif()
    const navigate = useNavigate()
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editEntryId, setEditEntryId] = useState<string | null>(null);
    const [backupOpen, setBackupOpen] = useState(false)


    const sortedLibrary =
        useKifSortedLibraryWithLearning(
            kifLibrary.library,
            kifLearning.records,
            kifLibrary.sortKey,
            kifLibrary.sortOrder
        );

    console.log("kifLibrary on screen", kifLibrary)
    const {
        checkedIds,
        selectEntry,
        toggleCheckbox,
        selectAll,
        clearAll,
        deleteSelected
    } = useLibraryHandlers(
            kifLibrary.library, kifLibrary.importFile, kifLibrary.deleteEntries,  
            kifPlayer.playLast, kifPlayer.playByEntryId,
            navigate
        );

    useEffect(() => {
        if (!open) clearAll();
    }, [open]);

    const handleMultipleFilesSelected = async (files: File[]) => {
        kifLibrary.importFiles(files)
    };

    // handler
        // リストアイテムクリック時
    const handleSelectEntry = (entry: KifLibraryEntry) => {
        setEditEntryId(entry.id);
        setEditDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setEditDialogOpen(false);
        setEditEntryId(null);
    };
    const handleBackupOpen = () => {
        console.log("backup dialog open")
        setBackupOpen(true)
    }
    const handleConfirm = (entry: KifLibraryEntry) => {
        //selectEntry(entry)
        console.log("handle confirm", entry.id)
        kifPlayer.playByEntryId(entry.id)
    }
    //const onBackup = () => {() => setBackupOpen(true)} 
    return (
        <AppLayout
            header={"Library"}
            footer={
                <>                    
                    <MultipleFilesButton label="棋譜ファイルを登録" onFileSelected={handleMultipleFilesSelected}/>
                    <button onClick={() => navigate("/player")}>戻る</button>
                </>
            }
        >
            <Box display="flex" alignItems="center" gap={1}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleBackupOpen()}
                >
                    バックアップ / 復元
                </Button>
            </Box>
            
            <LibraryControls
                library={sortedLibrary}
                checkedIds={checkedIds}
                selectAll={selectAll}
                clearAll={clearAll}
                handleDeleteSelected={deleteSelected}
                sortKey={kifLibrary.sortKey}
                setSortKey={kifLibrary.setSortKey}
                toggleSortOrder={kifLibrary.toggleSortOrder}
                sortOrder={kifLibrary.sortOrder}
            />

            <LibraryList 
                library={sortedLibrary} checkedIds={checkedIds} 
                handleCheckboxChange={toggleCheckbox} 
                onSelect={handleSelectEntry}/>

            {/* Dialog を JSX の下に配置 */}
            <KifEntryEditDialog
                open={editDialogOpen}
                entryId={editEntryId}
                onConfirm={handleConfirm}
                onClose={handleCloseDialog}
                onDelete={() => {
                    editEntryId && 
                        kifLibrary.deleteEntry(kifLibrary.findById(editEntryId)!);
                        //kifLearning.reset(editEntryId);
                    
                    handleCloseDialog();
                }}
            />
              {/* ★ここに置く */}
            <KifBackupDialog
                open={backupOpen}
                onClose={() => setBackupOpen(false)}
            />
        </AppLayout>

    )
}
