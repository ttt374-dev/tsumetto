import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import BoardView from '../components/player/BoardView/BoardView'
import LibrarySelectEntry from '../components/library/LibrarySelectEntry';
import MovesView from "../components/player/MovesView";
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import { createKifData, type KifLearningRecord } from '../types'
import { KifEntryEditDialog } from "../dialogs/KifEntryEditDialog";
import { formatAccuracy } from '../utils';
import type { KifEntry } from '../types/kifEntry';
import { createBoard, createPlayerState } from '../hooks/useKifPlayerOrig';
import { useKifEntryController } from '../hooks/useKifEntryController';
import type { Move } from '../types/'

function Learning({ record, currentEntryId, markSolved, markFailed,}: 
    { 
        record: KifLearningRecord,
        currentEntryId: string,
        markSolved: (id: string) => void,
        markFailed: (id: string) => void,
    }) {
    return (
        <>
            <Box>
                <IconButton
                    disabled={!currentEntryId}
                    onClick={() => currentEntryId && markSolved(currentEntryId)}>
                    <CheckCircleIcon />
                </IconButton>
                <IconButton
                    disabled={!currentEntryId}
                    onClick={() => currentEntryId && markFailed(currentEntryId)}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box>
                {record.solvedCount} | {record.failedCount}
            </Box >
        </>
    )
}
/////////////////////////////
export default function PlayerScreen() {
    const {
        kifEntryController, kifPlayerUI, kifNavigation,
        kifLearning,
        sortedEntries
    } = useKif()
    const {
        updateTitle,
        deleteEntry,
    } = kifEntryController
    const {
        currentEntry,
        currentEntryId,
        setCurrentEntryId,
        navigateTo,
    } = kifNavigation
    const {
        isMovesVisible, toggleMovesVisible,
        openEditDialog, setOpenEditDialog
    } = kifPlayerUI
    const { getRecord, markSolved, markFailed } = kifLearning
    const navigate = useNavigate()
    const kifData = currentEntry?.kifData ?? createKifData()
    const learningRecord = getRecord(currentEntryId)
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
                { /* エントリーリスト */}
                <Box>
                    <LibrarySelectEntry
                        currentEntryId={currentEntryId}
                        entities={sortedEntries}
                        onSelect={(id) => {
                            setCurrentEntryId(id)
                        }}
                    />
                </Box>
                { /* 盤面表示 */}
                <Box>
                    <BoardView
                        board={kifData.board}
                        hands={kifData.hands}
                    />
                </Box>
                <Box>
                    <button onClick={() => navigateTo("first")} disabled={sortedEntries.length == 0}>&lt;&lt;</button>
                    <button onClick={() => navigateTo("prev")} disabled={sortedEntries.length == 0}>&lt;</button>
                    <button onClick={() => navigateTo("next")} disabled={sortedEntries.length == 0}>&gt;</button>
                    <button onClick={() => navigateTo("last")} disabled={sortedEntries.length == 0}>&gt;&gt;</button>                    
                </Box>
                <Box sx={{display: "flex",flexDirection: "row", justifyContent: "center", margin: 1 }}>
                    <Box>
                        {/* 解答表示 */}
                        < button onClick={toggleMovesVisible}
                            disabled={kifData.moves.length === 0} >
                            {isMovesVisible ? "解答を隠す" : "解答を表示"}
                        </button >
                        {isMovesVisible &&
                            <MovesView moves={kifData.moves} />}
                    </Box>
                    <Box>
                        { learningRecord && currentEntryId &&
                            <Learning 
                                record={learningRecord}
                                currentEntryId={currentEntryId}
                                markSolved={markSolved}
                                markFailed={markFailed}
                            />
                        }                        
                    </Box>
                </Box>

                { /* ダイアログ　*/ }
                { currentEntry &&
                    <KifEntryEditDialog
                        open={openEditDialog}
                        entry={currentEntry}
                        onUpdateTitle={(title: string) => updateTitle(currentEntry.id, title)}
                        onConfirm={() => { }}
                        onClose={() => setOpenEditDialog(false)}
                        onDelete={() => deleteEntry(currentEntry.id)}
                    />
                }

            </>
        </AppLayout>
    )
}