import { useState } from 'react'
import { Box, IconButton } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

import BoardView from '../components/BoardView/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import MovesView from "../components/MovesView";
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import type { KifLearningRecord } from '../types/kifLearning'
import { KifEntryEditDialog } from "../dialogs/KifEntryEditDialog";
import { formatAccuracy } from '../utils';
import type { KifLibraryEntry } from '../types/kifLibrary';

export default function PlayerScreen() {
    const { kifLibrary, kifPlayer, kifLearning } = useKif()
    const { playNext, playPrev, playFirst, playLast, playByEntryId, playAtIndex } = kifPlayer

    const library = kifLibrary.sortedLibrary
    const kifPlayerState = kifPlayer.kifPlayerState
    const navigate = useNavigate()
    const kifData = kifPlayerState.kifData
    const curIndex = kifPlayerState.currentLibraryIndex
    
    const { getRecord, markSolved, markFailed } = kifLearning
    const curEntryId = kifPlayerState.currentEntryId
    const learningRecord= getRecord(curEntryId)

    // スワイプハンドラ
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {// 左スワイプ → 次の棋譜へ
            playNext()
        },
        onSwipedRight: () => {// 右スワイプ → 前の棋譜へ
            playPrev()
        },
        onSwipedUp: () => {  kifPlayer.hideMoves()},
        onSwipedDown: () => { kifPlayer.showMoves()},
        
        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,
    });
    const handleNavToLibrary = () => {
        navigate("/library")
    }
    const [ openEditDialog, setOpenEditDialog ] = useState(false)
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true)
    }
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false)
    }
    const handleDelete = () => {
        const entry = curEntryId && kifLibrary.findById(curEntryId)
        entry && kifLibrary.deleteEntry(entry)
        const index = library.findIndex(e => e.id === curEntryId);
        const nextEntry = library[index + 1] ?? library[index - 1] ?? null;
        playByEntryId(nextEntry.id)
    }
    ///
    const calcAccuracy = (
        record: KifLearningRecord | undefined
    ): number | null => {
        if (!record) return null;

        const total = record.solvedCount + record.failedCount;
        if (total === 0) return null;

        return record.solvedCount / total;
    };
    
    ////////////////////////////////////////////////////////////////////////
    return (
        <AppLayout
            header={<>
                <h2>
                    {curIndex !== undefined && `${curIndex + 1}: ${kifPlayerState.kifData.title}`}
                </h2>
            </>}
            footer={
                <button onClick={handleNavToLibrary}>ライブラリ管理</button>
            }
        >
            <>
            <KifEntryEditDialog 
                open={openEditDialog} 
                onConfirm={(entry: KifLibraryEntry) => {playByEntryId(entry.id)}}
                onClose={handleCloseEditDialog} 
                onDelete={handleDelete} entryId={curEntryId}/>
                
                {/* 内部リストを選択 */}
                <Box sx={{ display: "flex", flexDirection: "row"}}>
                    {library.length > 0 &&
                        <SelectLibraryEntry
                            currentIndex={kifPlayerState.currentLibraryIndex}
                            library={library} onSelect={playAtIndex} />
                    }
                    <IconButton onClick={handleOpenEditDialog}>
                        <EditIcon />
                    </IconButton>
                </Box>

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
                    <button onClick={playFirst} disabled={library.length == 0}>&lt;&lt;</button>
                    <button onClick={playPrev} disabled={library.length == 0}>&lt;</button>
                    <button onClick={playNext} disabled={library.length == 0}>&gt;</button>
                    <button onClick={playLast} disabled={library.length == 0}>&gt;&gt;</button>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",                                              
                        
                        //width: "100%",
                        gap: 2,
                    }}>
                <Box sx={{
                    display: "flex",
                    //flexGrow: 1,
                    flexDirection: "column",
                    overflowY: "auto",
                    gap: 2,
                    //minWidth: 120,
                }}>
                    <MovesView
                        moves={kifData.moves}
                        visible={kifPlayerState.showMoves}
                        onToggleVisible={kifPlayer.toggleShowMoves}
                        />
                    </Box>
                    <Box sx={{  gap: 2 }}>
                        <Box>
                            <IconButton
                                disabled={!curEntryId}
                                onClick={() => curEntryId && markSolved(curEntryId)}>
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                disabled={!curEntryId}
                                onClick={() => curEntryId && markFailed(curEntryId)}>
                                <CloseIcon />
                            </IconButton>

                        </Box>
                        {learningRecord && learningRecord.solvedCount + learningRecord.failedCount > 0 &&
                            <>
                                <div>
                                    正答率：{formatAccuracy(calcAccuracy(learningRecord)) }                
                                    ( {learningRecord.solvedCount} /
                                    {learningRecord.failedCount + learningRecord.solvedCount} )
                                </div>
                            </>
                        }                        
                    </Box>
                </Box>
            </>
        </AppLayout>
    )
}
