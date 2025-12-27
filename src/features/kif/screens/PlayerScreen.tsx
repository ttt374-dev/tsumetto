
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Stack, Divider } from '@mui/material';

import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import { createKifData } from '../domain/factory/KifDataFactory';
import KifEntryEditDialog from "../dialogs/KifEntryEditDialog";
import { useKifPlayerUI } from '../hooks/player/useKifPlayerUI';
import { useKifReplay } from '../hooks/player/useKifReplay';
import EventsView from '../components/player/EventsView';
import { useProblemProgress } from '../hooks/player/useProblemProgress';
import BoardPanel from '../components/player/BoardPanel';
import MoveControl from '../components/player/MoveControl';
import SolutionControl from '../components/player/SolutionControl';
import type { KifEvent } from "../types";
import type { KifLearningRecord } from "../types";
import type { ProblemPhase, ProblemResult } from "../hooks/player/useProblemProgress";
import ControlPanel from "../components/player/ControlPanel";

/////////////////////////////
export default function PlayerScreen() {
    // プロバイダからフックを取得（自分でフックを作らない）
    const {
        kifEntryController, kifNavigation,
        kifLearning
    } = useKif()
    const {
        updateTitle,
        deleteEntry,
    } = kifEntryController
    const {
        currentEntry,
        currentEntryId,
        navigateTo,        
        isFirstEntry,
        isLastEntry,
    } = kifNavigation
    const {
        openEditDialog, setOpenEditDialog
    } = useKifPlayerUI(currentEntryId)
    //const { currentPhase, showSolution, chooseResult } = useSolveSession(currentEntryId)
    const { currentPhase, chooseResult, setPhase } = useProblemProgress(currentEntryId)
    const { getLearningRecord, markSolved, markFailed } = kifLearning
    const navigate = useNavigate()
    const kifData = currentEntry?.kifData ?? createKifData()
    const learningRecord = getLearningRecord(currentEntryId)


    //const moves = getMoves(kifData)
    const events: KifEvent[] = kifData?.events ?? [];
    const { board: initialBoard, hands: initialHands } = kifData ?? createKifData()
       
    const { board, hands, currentIndex, setCurrentIndex } =
        useKifReplay(initialBoard, initialHands, events, currentEntryId)
    const prevMove = () => {
        currentIndex > 0 && setCurrentIndex(prev => prev - 1)
    }
    const nextMove = () => {
        currentIndex < events.length && setCurrentIndex(prev => prev + 1)
    }
    //////////
    return (
        <AppLayout
            header={
                (<Box
                    sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                    {currentEntry?.title ?? 'untitled'}
                </Box>)
            }
            footer={
                <Stack gap={2} direction="row" justifyContent="center">
                    <IconButton
                        onClick={() => setOpenEditDialog(true)} disabled={!currentEntryId}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => navigate("/library")}>
                        <LibraryBooksIcon />
                    </IconButton>
                </Stack>
            }
        >
            <>
            
                <BoardPanel
                    board={board}
                    hands={hands}
                    currentEntryId={currentEntryId}
                    isFirstEntry={isFirstEntry}
                    isLastEntity={isLastEntry}
                    navigateTo={navigateTo}
                />
                
                { /* 左：手順リスト、右：操作コントロール */}
                <Box sx={{ minHeight: 0, display: "flex", flexDirection: "row" }}>
                    <Box
                        border={1}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            overflowY: "auto",
                            gap: 2, flex: 7,                            
                        }}>
                        {currentPhase !== "problem" &&
                            <EventsView
                                events={events}
                                currentIndex={currentIndex}
                                onMoveClick={(i) => setCurrentIndex(i)} />

                        }
                    </Box>

                    <Box border={1} sx={{ width: 200 }}>
                        <ControlPanel
                            setCurrentIndex={setCurrentIndex}
                            currentEntryId={currentEntryId}
                            isFirstEntry={isFirstEntry}
                            isLastEntity={isLastEntry}
                            navigateTo={navigateTo}

                            prevMove={prevMove}
                            nextMove={nextMove}
                            setPhase={setPhase}
                            currentPhase={currentPhase}                            
                            learningRecord={learningRecord}
                            markSolved={markSolved}
                            markFailed={markFailed}
                            chooseResult={chooseResult}
                            
                        />
                    </Box>
                </Box>


                { /* ダイアログ　*/}
                {currentEntryId &&
                    <KifEntryEditDialog
                        open={openEditDialog}
                        entryId={currentEntryId}
                        onUpdateTitle={(title: string) => updateTitle(currentEntryId, title)}
                        onConfirm={() => { }}
                        onClose={() => setOpenEditDialog(false)}
                        onDelete={() => deleteEntry(currentEntryId)}
                    />
                }

            </>
        </AppLayout>
    )
}