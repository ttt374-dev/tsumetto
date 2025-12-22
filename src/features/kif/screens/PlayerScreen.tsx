import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import BoardView from '../components/BoardView/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import MovesView from "../components/MovesView";
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import { createKifData, type KifLearningRecord } from '../types'
import { KifEntryEditDialog } from "../dialogs/KifEntryEditDialog";
import { formatAccuracy } from '../utils';
import type { KifEntry } from '../types/kifEntity';
import { createBoard, createPlayerState } from '../hooks/useKifPlayerOrig';
import { useKifEntryController } from '../hooks/useKifEntryController';
import type { Move } from '../types/'


export default function PlayerScreen() {
    //const { kifLibrary, kifPlayer, kifLearning, kifPlayerUI } = useKif()
    const { kifEntryController, kifPlayerUI } = useKif()
    const { 
        currentEntry,
        currentEntryId,
        setCurrentEntryId,
        sortedEntries,
        
        navigateTo,
        updateTitle,
     } = kifEntryController
     const {
        isMovesVisible, toggleMovesVisible,
        openEditDialog, setOpenEditDialog
     } = kifPlayerUI

    const navigate = useNavigate()
    const kifData = currentEntry?.kifData ?? createKifData()
    //////////
    return (
        <AppLayout
            header={`${kifData.title} } (${currentEntryId?.slice(0, 3)})`}
            footer={
                <>
                
                    <IconButton onClick={() => setOpenEditDialog(true)} disabled={!currentEntryId}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate("/library")}>
                        <LibraryBooksIcon />
                    </IconButton>
                </>
            }
        >
            <>
                <Box>
                    <SelectLibraryEntry
                        currentEntryId={currentEntryId}
                        entities={sortedEntries}
                        onSelect={(id) => {
                            setCurrentEntryId(id)
                        }}
                    />
                </Box>
                <BoardView
                    board={kifData.board}
                    hands={kifData.hands}
                />
                <Box>
                    
                    <button onClick={() => navigateTo("prev")} disabled={sortedEntries.length == 0}>&lt;</button>
                    <button onClick={() => navigateTo("next")} disabled={sortedEntries.length == 0}>&gt;</button>
                    

                </Box>
                {/* 解答表示 */}
                < button onClick={toggleMovesVisible}
                    disabled={kifData.moves.length === 0} >
                    {isMovesVisible ? "解答を隠す" : "解答を表示"}

                </button >
                { isMovesVisible &&
                   <MovesView moves={kifData.moves} />}

                { /* ダイアログ　*/ }
                { currentEntry &&
                <KifEntryEditDialog
                    open={openEditDialog}
                    onUpdateTitle={(title: string) => updateTitle(currentEntry.id, title)}
                    onConfirm={() => {}}
                    onClose={() => setOpenEditDialog(false)}
                    onDelete={() => alert("delete")} entry={currentEntry} />
                }

            </>
        </AppLayout>
    )
}