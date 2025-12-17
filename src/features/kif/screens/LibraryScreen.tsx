
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

import FileButton from "../../../shared/components/FileButton";
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import LibraryList from '../components/LibraryList'
import LibraryControls from '../components/LibraryControls';
import { useLibraryHandlers } from '../hooks/useLibraryHandlers'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';
import type { SortKey, SortOrder } from '../types/kif'

export default function LibraryScreen() {
    const { kifLibrary, kifPlayer } = useKif()
    const navigate = useNavigate()
    const library = kifLibrary.library

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
    const setSortKey = (key: SortKey) => {
        kifLibrary.setState(prev => ({...prev, sortKey: key}))
    }
    const toggleSortOrder = () => {
        kifLibrary.setState(prev => ({...prev, sortOrder: kifLibrary.kifLibraryState.sortOrder === 'asc' ? 'desc' : 'asc'}))
    }



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
            <LibraryControls
                library={library}
                checkedIds={checkedIds}
                selectAll={selectAll}
                clearAll={clearAll}
                handleDeleteSelected={deleteSelected}
            />

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setSortKey('createdAt')}>追加順</button>
                <button onClick={() => setSortKey('title')}>名前順</button>
                <button onClick={() => setSortKey('moveCount')}>手数順</button>
                <button onClick={() => toggleSortOrder()}>
                    {kifLibrary.kifLibraryState.sortOrder === 'asc' ? '昇順' : '降順'}
                </button>
            </div>
            <LibraryList library={library} checkedIds={checkedIds} handleCheckboxChange={toggleCheckbox} onSelect={selectEntry}/>
        </AppLayout>

    )
}
