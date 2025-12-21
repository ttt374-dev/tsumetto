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
import type { KifLearningRecord } from '../types/kifLearning'
import { KifEntryEditDialog } from "../dialogs/KifEntryEditDialog";
import { formatAccuracy } from '../utils';
import type { KifLibraryEntry } from '../types/kifLibrary';

export default function PlayerScreen() {
    const { kifLibrary, kifPlayer, kifLearning, kifPlayerUI } = useKif()
    const { playNext, playPrev, playFirst, playLast, playByEntryId } = kifPlayer

    const sortedLibrary = kifLibrary.sortedLibrary
    const kifPlayerState = kifPlayer.kifPlayerState
    const navigate = useNavigate()
    const kifData = kifPlayerState.kifData
    //const curIndex = kifPlayerState.currentLibraryIndex    

    const { isMovesVisible, toggleMovesVisible } = kifPlayerUI
    const { getRecord, markSolved, markFailed } = kifLearning
    const curEntryId = kifPlayerState.currentEntryId
    //const curIndex = sortedLibrary.findIndex(e => e.id === curEntryId);
    const curIndex: number | null =
        (i => (i === -1 ? null : i))(
            sortedLibrary.findIndex(e => e.id === curEntryId)
        );

    const learningRecord = getRecord(curEntryId)

    // スワイプハンドラ
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {// 左スワイプ → 次の棋譜へ
            playNext(sortedLibrary)
        },
        onSwipedRight: () => {// 右スワイプ → 前の棋譜へ
            playPrev(sortedLibrary)
        },
        onSwipedUp: () => { kifPlayerUI.hideMoves() },
        onSwipedDown: () => { kifPlayerUI.showMoves() },

        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,
    });
    const handleNavToLibrary = () => {
        navigate("/library")
    }
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const handleOpenEditDialog = () => {
        setOpenEditDialog(true)
    }
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false)
    }
    const handleDelete = () => {
        const entry = curEntryId && kifLibrary.findById(curEntryId)
        entry && kifLibrary.deleteEntry(entry)
        const index = sortedLibrary.findIndex(e => e.id === curEntryId);
        const nextEntry = sortedLibrary[index + 1] ?? sortedLibrary[index - 1] ?? null;
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
                    <Typography variant='h6'>
                        {curEntryId ? `${kifPlayerState.kifData.title}` : "unselected"}
                    </Typography>
                </>}
            footer={
                <>

                    <IconButton onClick={handleOpenEditDialog} disabled={!curEntryId}>
                        <EditIcon />
                    </IconButton>

                    <IconButton onClick={handleNavToLibrary}>
                        <LibraryBooksIcon />
                    </IconButton>
                </>
            }
        >
            <>
                <KifEntryEditDialog
                    open={openEditDialog}
                    onConfirm={(entry: KifLibraryEntry) => { playByEntryId(entry.id) }}
                    onClose={handleCloseEditDialog}
                    onDelete={handleDelete} entryId={curEntryId} />

                {/* 内部リストを選択 */}
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    
                    {sortedLibrary.length > 0 &&
                        <SelectLibraryEntry
                            currentEntryId={curEntryId}
                            library={sortedLibrary} onSelect={(id) => kifPlayer.playByEntryId(id)} />
                    }
                    
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
                    <button onClick={() => playFirst(sortedLibrary)} disabled={sortedLibrary.length == 0}>&lt;&lt;</button>
                    <button onClick={() => playPrev(sortedLibrary)} disabled={sortedLibrary.length == 0}>&lt;</button>
                    <button onClick={() => playNext(sortedLibrary)} disabled={sortedLibrary.length == 0}>&gt;</button>
                    <button onClick={() => playLast(sortedLibrary)} disabled={sortedLibrary.length == 0}>&gt;&gt;</button>

                </Box>
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", margin: 1 }}>
                    {learningRecord && learningRecord.solvedCount + learningRecord.failedCount > 0 &&
                        
                            <div>
                                { /* 正答率：{formatAccuracy(calcAccuracy(learningRecord))} 
                                ( {learningRecord.solvedCount} /
                                {learningRecord.failedCount + learningRecord.solvedCount} )*/ }
                            </div>
                        
                    }
                    {/* 解答表示 */}
                    < button onClick={toggleMovesVisible}
                        disabled={kifData.moves.length === 0} >
                        {isMovesVisible ? "解答を隠す" : "解答を表示"}
                        
                    </button >
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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        height: "100vh",
                        //width: "100%",
                        gap: 2,
                        overflowY: "auto",
                    }}>
                    <div>
                        
                        {
                            isMovesVisible &&
                            kifData.moves.map((m, i) => (
                                <div key={i} style={{ padding: "2px 0" }}>
                                    {i + 1}: {m.isBlack ? '▲' : '△'} {m.moveText} ({m.from})
                                </div>
                            ))
                        }
                    </div>


                </Box>
            </>
        </AppLayout>
    )
}
