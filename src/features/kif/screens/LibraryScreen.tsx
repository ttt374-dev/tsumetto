
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import FileButton from "../../../shared/components/FileButton";
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import LibraryList from '../components/LibraryList'
import LibraryControls from '../components/LibraryControls';
import { useLibraryHandlers } from '../hooks/useLibraryHandlers'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';

export default function LibraryScreen() {
    const { kifLibrary, kifPlayer } = useKif()
    const navigate = useNavigate()
    

    const {
        checkedIds,
        importFileAndPlay,
        selectEntry,
        toggleCheckbox,
        selectAll,
        clearAll,
        deleteSelected
    } = useLibraryHandlers(kifLibrary, kifPlayer, navigate);

    useEffect(() => {
        if (!open) clearAll();
    }, [open]);

    const handleMultipleFilesSelected = async (files: File[]) => {
        //console.log(kifLibrary)
        kifLibrary.importFiles(files)
};

    return (
        <AppLayout
            header={"Library"}
            footer={
                <>
                    <FileButton label="棋譜ファイルを登録" onFileSelected={importFileAndPlay} />
                    <MultipleFilesButton onFileSelected={handleMultipleFilesSelected}/>
                    <button onClick={() => navigate("/player")}>戻る</button>
                </>
            }
        >
            <LibraryControls
                library={kifLibrary.library}
                checkedIds={checkedIds}
                selectAll={selectAll}
                clearAll={clearAll}
                handleDeleteSelected={deleteSelected}
            />
            <LibraryList library={kifLibrary.library} checkedIds={checkedIds} handleCheckboxChange={toggleCheckbox} onSelect={selectEntry}/>
        </AppLayout>

    )
}
