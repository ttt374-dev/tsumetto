import { useSwipeable } from 'react-swipeable'
import { Stack, Box} from '@mui/material'

import type { Board, Hands} from '../../types'
import type { PlayerPhase } from '../../hooks/player/useKifPhase'
import BoardView from './BoardView'


export function BoardPanel({
    board, hands,
    currentPhase,
    advanceStep, retreatStep,
    advanceMove, retreatMove,
    advancePhase, retreatPhase

}: {
    board: Board, hands: Hands,
    advanceStep: () => void
    retreatStep: () => void
    currentPhase: PlayerPhase
    advanceMove: () => void
    retreatMove: () => void
    advancePhase: () => void
    retreatPhase: () => void
}){
    const stepSwipeHandlers = useSwipeable({
        onSwipedRight: () => {
            retreatStep()
        },
        onSwipedLeft: () => {
            advanceStep()            
        },
        onSwipedDown: () => {             
            currentPhase === "problem" && advancePhase()
            advanceMove()
        },
        onSwipedUp: () => {
            currentPhase === "solution" && retreatPhase()
            retreatMove()
        },

        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,

    })
    /////////////////
    return (
        <>
        <Stack justifyContent="center" m={2} >
                    <Box {...stepSwipeHandlers} sx={{ userSelect: "none", }}>
                        <BoardView
                            board={board}
                            hands={hands}>
                        </BoardView>
                    </Box>
                </Stack>
        </>
    )
}