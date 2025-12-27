import { Stack } from "@mui/material";
import { useSwipeable } from "react-swipeable";

import type { ProblemPhase } from "../../hooks/player/useProblemProgress"


type Props = {
    currentPhase: ProblemPhase 
    prevMove: () => void,
    nextMove: () => void,
    setPhase: (phase: ProblemPhase) => void;
    setCurrentIndex: (index: number) => void;
}
export default function SolutionControl({currentPhase, prevMove, nextMove, setPhase, setCurrentIndex}: Props){
    
    // スワイプハンドラ    
    const moveSwipeHandlers = useSwipeable({
        onSwipedUp: () => {
            prevMove()
        },
        onSwipedDown: () => {
            currentPhase === "problem" && setPhase("solution")
            nextMove()
        },

        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,

    })
    return (
        <Stack {...moveSwipeHandlers} direction="column" gap={0} margin={0}>
            {currentPhase === "problem" ?
                <button onClick={() => {
                    setPhase("solution")
                    nextMove()
                }}>
                    解答を表示
                </button> :
                <button onClick={() => {
                    setPhase("problem")
                    setCurrentIndex(0)
                }}>
                    解答を非表示
                </button>
            }

        </Stack>
    )
}
