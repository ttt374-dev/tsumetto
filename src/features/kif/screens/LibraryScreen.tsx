import { useState } from 'react'
import { Stack, Box,  } from "@mui/material";

import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';
import type { KifEntry } from "../types";
import { useKifLibraryList } from '../hooks/library/useLibraryList';
import LibraryBulkSelectionControl from '../components/library/LibraryBulkSelectionControl';
import LibrarySortControl from '../components/library/LibrarySortControl';
import LibraryDeleteControl from '../components/library/LibraryDeleteControl';
import LibraryList from '../components/library/LibraryList';
import { KifEntryEditDialog } from '../dialogs/KifEntryEditDialog';

//////////////
export default function LibraryScreen() {    
    const { kifEntryController, kifNavigation,         
        kifLibrarySort, sortedEntries
    } = useKif()
    const {
        importFiles,
        deleteEntries,
    } = kifEntryController
    
    const {
        setCurrentEntryId,
    } = kifNavigation
    
    const { sort, setSortOrder, setSortKey } = kifLibrarySort    
    const {
        checkedIds, isChecked, toggleChecked, 
        clearChecked, selectAllChecked
    } = useKifLibraryList(sortedEntries)

    // edit mode
    const [ editMode, setEditMode ] = useState(false)
    const toggleEditMode = () => {
        setEditMode(prev => !prev)
    }
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [entryToEditId, setEntryToEditId ] = useState<string|null>(null)
    const {
        updateTitle,
        deleteEntry,
    } = kifEntryController
    return (
        <AppLayout
            header={"Library"}
            footer={
                <>
                <button onClick={toggleEditMode}>
                    { editMode ? "Edit" : "View"} Mode
                </button>
                <MultipleFilesButton 
                    label="棋譜ファイルを登録" 
                    onFileSelected={
                        async (files: File[]) => {
                            importFiles(files)
                        }
                    }
                />
                </>
            }
        >
            { /* コントロール */}   
            <Stack direction="row">
                <LibraryBulkSelectionControl
                    entries={sortedEntries}
                    checkedIds={checkedIds}
                    selectAllCheckbox={selectAllChecked}
                    clearAllCheckbox={clearChecked}
                />
                <LibraryDeleteControl 
                    entries={sortedEntries}
                    checkedIds={checkedIds}
                    onDelete={(entries: KifEntry[]) => deleteEntries(entries)}
                />
                <Box sx={{ flexGrow: 1 }} />
                <LibrarySortControl sort={sort} setSortKey={setSortKey} setSortOrder={setSortOrder} />
            </Stack>
            { /*  エントリーリスト */}
            <LibraryList 
                sortedEntries={sortedEntries}
                setCurrentEntryId={setCurrentEntryId}
                isChecked={isChecked}
                toggleChecked={toggleChecked}
                onEdit={(entryId: string) => {
                    setEntryToEditId(entryId)
                    setOpenEditDialog(true)
                }}
                editMode={editMode}
            />
            { /* ダイアログ　*/ }
            {entryToEditId &&
                <KifEntryEditDialog
                    open={openEditDialog}
                    entryId={entryToEditId}
                    onUpdateTitle={(title: string) => updateTitle(entryToEditId, title)}
                    onConfirm={() => { }}
                    onClose={() => setOpenEditDialog(false)}
                    onDelete={() => deleteEntry(entryToEditId)}
                />
            }
        </AppLayout>
    )
}