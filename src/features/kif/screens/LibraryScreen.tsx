
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
import { useKifEntryEditDialog } from '../hooks/useKifEntryEditDialog';

export default function LibraryScreen() {
    const { kifLibrary, kifPlayer, kifLearning } = useKif()
    const navigate = useNavigate()
    const [backupOpen, setBackupOpen] = useState(false)
    const entryDialog = useKifEntryEditDialog()
    const [editMode, setEditMode] = useState(false);

    const sortedLibrary =
        useKifSortedLibraryWithLearning(
            kifLibrary.library,
            kifLearning.records,
            kifLibrary.sortKey,
            kifLibrary.sortOrder
        );
    const {
        checkedIds,
        toggleCheckbox,
        selectAll,
        clearAll,
        deleteSelected
    } = useLibraryHandlers(
            kifLibrary.library, kifLibrary.importFile, kifLibrary.deleteEntries,  
            kifPlayer.playLast, kifPlayer.playByEntryId,
            navigate
        );

    const handleMultipleFilesSelected = async (files: File[]) => {
        kifLibrary.importFiles(files)
    };
    const toggleEditMode = () => {
        setEditMode(!editMode)
    }
    // handler
        // リストアイテムクリック時
    const handleSelectEntry = (entry: KifLibraryEntry) => {
        if (editMode){
            entryDialog.openFor(entry.id)
        } else {
            kifPlayer.playByEntryId(entry.id)
            navigate("/player")
        }
    }

    return (
        <AppLayout
            header={"Library"}
            footer={
                <>                    
                { /* <button onClick={() => toggleEditMode()}>選択削除モード</button> */ }
                <MultipleFilesButton label="棋譜ファイルを登録" onFileSelected={handleMultipleFilesSelected}/>
                <button onClick={() => navigate("/player")}>戻る</button>
                </>
            }
        >            
            <LibraryControls
                library={sortedLibrary}
                checkedIds={checkedIds}
                selectAllCheckbox={selectAll}
                clearAllCheckbox={clearAll}
                onDeleteSelected={deleteSelected}
                editMode={editMode}
                sortKey={kifLibrary.sortKey}
                setSortKey={kifLibrary.setSortKey}
                toggleSortOrder={kifLibrary.toggleSortOrder}
                sortOrder={kifLibrary.sortOrder}
                onBackup={() => setBackupOpen(true)}
                
            />

            <LibraryList 
                library={sortedLibrary} checkedIds={checkedIds} 
                onCheckboxChange={toggleCheckbox} 
                onSelect={handleSelectEntry}
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                clearAllCheckbox={clearAll}
                />

            {/* Dialog を JSX の下に配置 */}
            <KifEntryEditDialog
                open={entryDialog.open}
                entryId={entryDialog.entryId}
                onConfirm={(entry: KifLibraryEntry) => { 
                    console.log("confirm", entry.id)
                    kifPlayer.playByEntryId(entry.id)}
                 }
                onClose={entryDialog.close}
                onDelete={() => {
                    const entry = entryDialog.entryId && kifLibrary.findById(entryDialog.entryId)
                    entry && kifLibrary.deleteEntry(entry);
                    entryDialog.close;
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
