import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import BoardView from '../components/player/BoardView/BoardView';
import SelectEntry from '../components/player/SelectEntry';
import MovesView from '../components/player/MovesView';
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import { createKifData, type KifLearningRecord } from '../types'
import KifEntryEditDialog from "../dialogs/KifEntryEditDialog";
import { formatAccuracy } from '../utils';
import type { KifEntry } from '../types/kifEntry';
//import { createBoard, createPlayerState } from '../hooks/useKifPlayerOrig';
import { useKifEntryController } from '../hooks/useKifEntryController';
import type { Move } from '../types/'
import MarkLearning from '../components/player/MarkLearning';
import { useKifPlayerUI } from '../hooks/player/useKifPlayerUI';
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
    } = useKifPlayerUI()
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
          onSwipedUp: () => { hideMoves() },
          onSwipedDown: () => { showMoves() },
  
          trackMouse: true, // PCでもマウスでスワイプ可能
          preventScrollOnSwipe: true,
      });
    //////////
    return (
        <AppLayout
            header={`${kifData.title}`}
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
                    <SelectEntry
                        currentEntryId={currentEntryId}
                        entities={sortedEntries}
                        onSelect={(id) => {
                            setCurrentEntryId(id)
                        }}
                    />
                </Box>
                { /* 盤面表示 */}
                <Box {...swipeHandlers} sx={{
                    userSelect: "none", // 選択防止
                    touchAction: "pan-y", // 縦スクロールは阻害しない
                }}>
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
                            <MarkLearning 
                                record={learningRecord}
                                currentEntryId={currentEntryId}
                                markSolved={markSolved}
                                markFailed={markFailed}
                            />
                        }                        
                    </Box>
                </Box>

                { /* ダイアログ　*/ }
                { currentEntryId &&
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