import { useEffect, useState } from 'react'
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";

import BoardView from '../../components/player/BoardView/BoardView';
import NavigationButtons from '../../components/player/NavigationButtons';
import type { Board, Hands, KifLearningRecord } from '../../types';


type Props = {
    board: Board,
    hands: Hands,
    currentEntryId: string,
    isFirstEntry: (entryId: string) => boolean,
    nextEntryAvailable: (entryId: string) => boolean,
    navigateTo: (dest: string) => void
}
export default function BoardPanel({
        board, hands, currentEntryId,
        isFirstEntry, nextEntryAvailable, navigateTo,
    }: Props){
        const navigationSwipeHandlers = useSwipeable({
        onSwipedLeft: () => {// 左スワイプ → 次の棋譜へ
            navigateTo("next")
        },
        onSwipedRight: () => {// 右スワイプ → 前の棋譜へ
            navigateTo("prev")
        },

        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,
    })
    return (<>
                        { /* 盤面表示 */}
                <Box {...navigationSwipeHandlers}
                    sx={{
                        userSelect: "none", // 選択防止
                        touchAction: "pan-y", // 縦スクロールは阻害しない
                    }}>
                    <BoardView board={board} hands={hands}/>
                </Box>
                <NavigationButtons
                    currentEntryId={currentEntryId}
                    isFirstEntry={isFirstEntry}
                    nextEntryAvailable={nextEntryAvailable}
                    navigateTo={navigateTo}
                />
                </>
    )
}