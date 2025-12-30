import { Stack, Box  } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";

import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';
import type { KifEntry, Problem } from "../types";
import { useKifLibraryList } from '../hooks/library/useLibraryList';
import LibraryBulkSelectionControl from '../components/library/LibraryBulkSelectionControl';
import LibrarySortControl from '../components/library/LibrarySortControl';
import LibraryDeleteControl from '../components/library/LibraryDeleteControl';
import LibraryList from '../components/library/LibraryList';
import KifEntryEditDialog from '../dialogs/KifEntryEditDialog';
import KifBackupDialog from '../dialogs/KifBackupDialog';
import { useKifLibraryUI } from '../hooks/library/useKifLibraryUI';
import { useKifLibrarySort } from "../hooks/library/useKifLibrarySort";
import { useKifSortedEntries } from "../hooks/library/useKifSortedEntries";
import { useProblemImporter } from "../hooks/problem/useProblemImporter";
import { useEditDialog } from "../hooks/library/useEditDialog";

//////////////
export default function LibraryScreen() {    
    const { 
        learningRepository, problems, problemRepository,
    } = useKif()
    const { sort, setSortKey, setSortOrder }= useKifLibrarySort()    
    
    const { records, findByProblemId } = learningRepository
    const { importFiles } = useProblemImporter()
    const sortedEntries = useKifSortedEntries(problems, records, sort)

    const {
        checkedIds, isChecked, toggleChecked, 
        clearChecked, selectAllChecked
    } = useKifLibraryList(sortedEntries)
    
    const { 
        entryToEditId: entryIdToEdit,
        setEntryToEditId,
        editMode,
        setEditMode,
        toggleEditMode,
        openEditDialog,
        setOpenEditDialog,
        
        backupOpen,
        setBackupOpen,

    } = useKifLibraryUI()
    const editDialogApi = useEditDialog(entryIdToEdit, problemRepository)
    const { removeMany, findById, update } = problemRepository
    //const { updateTitle: handleUpdateTitle } = useEditDialog(entryIdToEdit, problemRepository)
    const navigate = useNavigate()

    const handleDeleteMany = (problems: Problem[]):  Promise<void> => {
        //(entries: KifEntry[]) => removeMany(entries.map(e => e.id))
        return removeMany(problems.map(e => e.id))
    }
    
    ////////////////////////////////////////
    //const firstSelectedId = checkedIds.values().next().value
    return (
        <AppLayout
            header={"Library"}
            footer={
                <Stack direction="row" justifyContent="center">
                    <MultipleFilesButton
                        label="登録"
                        useIconButton={false}
                        onFileSelected={
                            async (files: File[]) => {
                                importFiles(files)
                            }
                        }
                    />
                    <button onClick={() => navigate(-1)}>
                        戻る
                    </button>

                    
                </Stack>
            }
        >
            { /* コントロール */}               
            <Stack direction="row">                
                <LibraryBulkSelectionControl
                    entries={sortedEntries}
                    checkedIds={checkedIds}
                    selectAllCheckbox={ () => {
                        selectAllChecked(); 
                        setEditMode(true)
                    }}
                    clearAllCheckbox={ () => {
                        clearChecked()
                        setEditMode(true)
                    }}
                />
                <LibraryDeleteControl
                    entries={sortedEntries}
                    checkedIds={checkedIds}
                    onDelete={handleDeleteMany}
                    //onDelete={(entries: KifEntry[]) => deleteEntries(entries)}
                />
                <IconButton onClick={toggleEditMode}>
                    {editMode ? <EditIcon /> : <VisibilityIcon />}
                </IconButton>

                <IconButton onClick={()=>setBackupOpen(true)}>
                    <BackupIcon></BackupIcon>
                </IconButton>
                
                <Box sx={{ flexGrow: 1 }} />
                <LibrarySortControl sort={sort} setSortKey={setSortKey} setSortOrder={setSortOrder} />
            </Stack>
            
            { /*  エントリーリスト */}
            <LibraryList 
                sortedEntries={sortedEntries}
                isChecked={isChecked}
                toggleChecked={toggleChecked}
                onEntryClick={(entryId: string) => {
                    if (editMode) {
                        setEntryToEditId(entryId)
                        setOpenEditDialog(true)
                    } else {
                        toggleChecked(entryId)
                        //setCurrentEntryId(entryId)
                        navigate(`/player/${entryId}`)
                    }
                }}
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                clearAllCheckbox={clearChecked}
                
            />
            { /* ダイアログ　*/ }
            
            {entryIdToEdit &&
                <KifEntryEditDialog
                    open={openEditDialog}
                    entryId={entryIdToEdit}
                    //onUpdateTitle={(title: string) => updateTitle(entryToEditId, title)}
                    onUpdateTitle={(title) => editDialogApi.updateTitle(title)}   // TODO
                    onConfirm={() => { }}
                    onClose={() => setOpenEditDialog(false)}                    
                    //onDelete={() => deleteEntry(entryToEditId)}
                    onDelete={() => editDialogApi.remove()}  // TODO
                />
            }
            <KifBackupDialog
                open={backupOpen}
                onClose={() => setBackupOpen(false)}
            />
        </AppLayout>
    )
}