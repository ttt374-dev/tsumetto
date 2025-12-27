
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
import { ProblemControl } from '../components/player/ProblemControl';
import BoardPanel from '../components/player/BoardPanel';
import MoveControl from '../components/player/MoveControl';
import SolutionControl from '../components/player/SolutionControl';
import type { KifEvent } from "../types";

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
        nextEntryAvailable,
        isFirstEntry,
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
                <Stack gap={2}>
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
            { currentEntryId &&
                <BoardPanel
                    board={board}
                    hands={hands}
                    currentEntryId={currentEntryId}
                    isFirstEntry={isFirstEntry}
                    nextEntryAvailable={nextEntryAvailable}
                    navigateTo={navigateTo}
                />
            }
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
                        <Stack direction="column" divider={<Divider />}>
                            <SolutionControl
                                prevMove={prevMove}
                                nextMove={nextMove}
                                setPhase={setPhase}
                                currentPhase={currentPhase}
                                setCurrentIndex={setCurrentIndex}
                            />
                            <MoveControl 
                                prevMove={prevMove}
                                nextMove={nextMove}
                                setPhase={setPhase}
                            />
                            
                            {learningRecord && currentEntryId &&
                                <ProblemControl
                                    currentEntryId={currentEntryId}
                                    learningRecord={learningRecord}
                                    currentPhase={currentPhase}
                                    markSolved={markSolved}
                                    markFailed={markFailed}
                                    chooseResult={chooseResult}
                                    nextEntryAvailable={nextEntryAvailable}
                                    navigateTo={navigateTo}
                                />
                            }                            
                        </Stack>
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