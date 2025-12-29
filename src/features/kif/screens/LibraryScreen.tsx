import { Stack, Box  } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplyIcon from "@mui/icons-material/Reply";


import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';
import type { KifEntry } from "../types";
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

//////////////
export default function LibraryScreen() {    
    const { sort, setSortKey, setSortOrder }= useKifLibrarySort()
    

    const navigate = useNavigate()
    const { //kifEntryController, 
        learningRepository: kifLearning, entries, problemRepository,
    } = useKif()
    const { records: learningRecords } = kifLearning
    const { importFiles } = useProblemImporter()
    /*
    const {
        importFiles,
        deleteEntries,
    } = kifEntryController
     */
    const sortedEntries = useKifSortedEntries(entries, learningRecords, sort)
    /*
    const {
        setCurrentEntryId,
    } = kifNavigation
    */
    //const { sort, setSortOrder, setSortKey } = kifLibrarySort
    const { getLearningRecord } = kifLearning
    
    const {
        checkedIds, isChecked, toggleChecked, 
        clearChecked, selectAllChecked
    } = useKifLibraryList(sortedEntries)

    // edit mode
    
    /*
    const {
        //updateTitle,
        //deleteEntry,
    } = kifEntryController
     */
    const { 
        entryToEditId,
        setEntryToEditId,
        editMode,
        setEditMode,
        toggleEditMode,
        openEditDialog,
        setOpenEditDialog,
        
        backupOpen,
        setBackupOpen,

    } = useKifLibraryUI()
    const { removeMany } = problemRepository

    /*
    const [entryToEditId, setEntryToEditId ] = useState<string|null>(null)
    const [ editMode, setEditMode ] = useState(false)
    const toggleEditMode = () => {
        setEditMode(prev => !prev)
    }
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [backupOpen, setBackupOpen] = useState(false)
    */
    ////////////////////////////////////////
    const firstSelectedId = checkedIds.values().next().value
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
                    onDelete={(entries: KifEntry[]) => removeMany(entries.map(e => e.id))}
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
                getLearningRecord={getLearningRecord}
            />
            { /* ダイアログ　*/ }
            
            {entryToEditId &&
                <KifEntryEditDialog
                    open={openEditDialog}
                    entryId={entryToEditId}
                    //onUpdateTitle={(title: string) => updateTitle(entryToEditId, title)}
                    onUpdateTitle={(title: string)=> {}}   // TODO
                    onConfirm={() => { }}
                    onClose={() => setOpenEditDialog(false)}                    
                    //onDelete={() => deleteEntry(entryToEditId)}
                    onDelete={(() => {})}  // TODO
                />
            }
            <KifBackupDialog
                open={backupOpen}
                onClose={() => setBackupOpen(false)}
            />
        </AppLayout>
    )
}