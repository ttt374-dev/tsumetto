import { useEffect, useState } from 'react'
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Stack, Divider } from '@mui/material';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

import BoardView from '../components/player/BoardView/BoardView';
import SelectEntry from '../components/player/SelectEntry';
import MovesView from '../components/player/MovesView';
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import { createKifData } from '../domain/factory/KifDataFactory';
import KifEntryEditDialog from "../dialogs/KifEntryEditDialog";
import MarkLearning from '../components/player/MarkLearning';
import { useKifPlayerUI } from '../hooks/player/useKifPlayerUI';
import { useKifReplay } from '../hooks/player/useKifReplay';
import { getMoves } from '../types';
import EventsView from '../components/player/EventsView';
import { calcAccuracy, formatAccuracy } from '../utils';
import type { SxProps, Theme } from "@mui/material/styles";

export const noFocusVisible: SxProps<Theme> = {
  '&:focus': {
    outline: 'none',
  },
};

/////////////////////////////
export default function PlayerScreen() {
    const {
        kifEntryController, kifNavigation,
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
        hideMoves, showMoves,
        isMovesVisible, toggleMovesVisible,
        openEditDialog, setOpenEditDialog
    } = useKifPlayerUI(currentEntryId)
    const { getRecord, markSolved, markFailed } = kifLearning
    const navigate = useNavigate()
    const kifData = currentEntry?.kifData ?? createKifData()
    const learningRecord = getRecord(currentEntryId)

    // スワイプハンドラ
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {// 左スワイプ → 次の棋譜へ
            navigateTo("next")
        },
        onSwipedRight: () => {// 右スワイプ → 前の棋譜へ
            navigateTo("prev")
        },
        onSwipedUp: () => {
            currentIndex === 0 && hideMoves();
            prevMove()
        },
        onSwipedDown: () => {
            !isMovesVisible && showMoves()
            nextMove()
        },

        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,
    });

    
    //const moves = getMoves(kifData)
    const events = kifData.events
    const { board: initialBoard, hands: initialHands} = kifData
    const { board, hands, currentIndex, setCurrentIndex } =
        useKifReplay(initialBoard, initialHands, events, currentEntryId)
    const prevMove = () => {
        currentIndex > 0 && setCurrentIndex(prev => prev - 1)
    }
    const nextMove = () => {
        currentIndex < events.length && setCurrentIndex(prev => prev + 1)
    }

    const handleSolved = () => {
        currentEntryId && markSolved(currentEntryId);
        navigateTo("next")
     }
    const handleFailed = () => {
        currentEntryId && markFailed(currentEntryId)
        navigateTo("next")
    }
    ///
    
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
                { currentEntry?.title ?? 'untitled' }
                </Box>)
            }
            footer={
                <>
                    <IconButton 

                    onClick={() => setOpenEditDialog(true)} disabled={!currentEntryId}>
                        <EditIcon />
                    </IconButton>
                    <IconButton                        
                        onClick={() => navigate("/library")}>
                        <LibraryBooksIcon />
                    </IconButton>
                </>
            }
        >
            <>  
                { /* エントリーリスト */}
                { /* 
                <Box>
                    <SelectEntry
                        currentEntryId={currentEntryId}
                        entities={sortedEntries}
                        onSelect={(id) => {
                            setCurrentEntryId(id)
                        }}
                    />
                </Box>
                */ }
                { /* 盤面表示 */}
                <Box {...swipeHandlers} sx={{
                    userSelect: "none", // 選択防止
                    touchAction: "pan-y", // 縦スクロールは阻害しない
                }}>
                    <BoardView
                        board={board}
                        hands={hands}
                    />
                </Box>
                <Box>
                    { /* 
                    <Button sx={noFocusVisible} onClick={() => navigateTo("first")} disabled={sortedEntries.length == 0}>&lt;&lt;</Button>
                    <Button sx={noFocusVisible} onClick={() => navigateTo("prev")} disabled={sortedEntries.length == 0}>&lt;</Button>
                    <Button sx={noFocusVisible} onClick={() => navigateTo("next")} disabled={sortedEntries.length == 0}>&gt;</Button>
                    <Button sx={noFocusVisible} onClick={() => navigateTo("last")} disabled={sortedEntries.length == 0}>&gt;&gt;</Button>
*/ }
                    <IconButton sx={{...noFocusVisible, px: 2}} onClick={() => navigateTo("first")}>
                        <FirstPageIcon/>
                    </IconButton>
                    
                    <IconButton sx={{...noFocusVisible, px: 2}} onClick={() => navigateTo("prev")}>
                        <ChevronLeftIcon/>
                    </IconButton>
                    <IconButton sx={{...noFocusVisible, px: 2}}  onClick={() => navigateTo("next")}>
                        <ChevronRightIcon/>
                    </IconButton>
                    <IconButton sx={{...noFocusVisible, px: 2}} onClick={() => navigateTo("last")}>
                        <LastPageIcon/>
                    </IconButton>
                    
                </Box>

                <Box sx={{ minHeight: 0, display: "flex", flexDirection: "row" }}>
                    <Box
                        border={1} 
                        sx={{
                        display: "flex",
                        justifyContent: "center",
                        //height: "100%",
                        //width: "100%",
                        gap: 2,
                        flex: 7,
                        overflowY: "auto",
                    }}>
                        {isMovesVisible ?
                            <EventsView
                                events={events}
                                currentIndex={currentIndex}
                                onMoveClick={(i) => setCurrentIndex(i)} /> :
                            <Button onClick={() => {
                                showMoves()
                                nextMove()
                            }}>
                                解答を表示
                            </Button>}
                    </Box>

                    <Box border={1} sx={{ flex: 3}}>
                        <Stack direction="column" divider={<Divider/>}>
                            <Stack direction="column" gap={2} margin={2}>
                                { isMovesVisible && <>
                                <IconButton sx={noFocusVisible} onClick={prevMove}>                                    
                                    <ExpandLessIcon />
                                </IconButton>
                                <IconButton sx={noFocusVisible}
                                    onClick={() => { showMoves(); nextMove() }}>
                                    <ExpandMoreIcon />
                                </IconButton>
                                </>}

                            </Stack>
                            <Stack gap={2} margin={2}>
                                { learningRecord && 
                                    <Stack direction="column">
                                        {formatAccuracy(calcAccuracy(learningRecord))}
                                        [{learningRecord.solvedCount} | {learningRecord.failedCount}]

                                        {isMovesVisible &&
                                            <Stack direction="row" gap={2}>
                                                <button onClick={handleSolved}>
                                                    正答
                                                </button>
                                                <button onClick={handleFailed}>
                                                    誤答
                                                </button>
                                            </Stack>
                                        }
                                    </Stack>

                                }
                            </Stack>
                        </Stack>
                    </Box>
                </Box>

{ /* 
                    <Box sx={{
                        width: 200,        // 固定幅
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}>
                        <Box>
                        {formatAccuracy(calcAccuracy(learningRecord ?? undefined))}
                        </Box>
                        {isMovesVisible && <>
                            {currentIndex} / {events.length}
                            <button onClick={prevMove}>
                                前の手へ
                            </button>
                            <button onClick={() => { showMoves(); nextMove() }}>
                                次の手へ
                            </button></>
                        }
                    </Box>
* /}

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