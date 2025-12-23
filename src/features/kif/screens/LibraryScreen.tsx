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

//////////////
export default function LibraryScreen() {
    
    const { kifEntryController, kifNavigation,         
        kifLibrarySort, sortedEntries } = useKif()
    const {
        importFiles,
        deleteEntries,
    } = kifEntryController
    
    const {
        setCurrentEntryId,
    } = kifNavigation
    
    const { sort, setSortOrder, setSortKey } = kifLibrarySort    
    const {checkedIds, isChecked, toggleChecked, clearChecked, selectAllChecked} = useKifLibraryList(sortedEntries)

    return (
        <AppLayout
            header={"Library"}
            footer={
                <MultipleFilesButton 
                    label="棋譜ファイルを登録" 
                    onFileSelected={
                        async (files: File[]) => {
                            importFiles(files)
                        }
                    }
                />
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
            />
            
        </AppLayout>
    )
}