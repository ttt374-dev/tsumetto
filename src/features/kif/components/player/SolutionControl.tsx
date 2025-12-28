import { Stack } from "@mui/material";


import type { ProblemPhase } from "../../hooks/player/useProblemProgress"


type Props = {
    currentPhase: ProblemPhase 
    //prevMove: () => void,
    //nextMove: () => void,
    //setPhase: (phase: ProblemPhase) => void;
    //setCurrentIndex: (index: number) => void;
    onShowAnswer: () => void;
    onHideAnswer: () => void;
}
//export default function SolutionControl({currentPhase, prevMove, nextMove, setPhase, setCurrentIndex}: Props){
export default function SolutionControl({currentPhase, onShowAnswer, onHideAnswer}: Props){
    

    return (
        <Stack direction="column" gap={0} margin={0}>            
             { currentPhase === "problem" ?
                <button onClick={onShowAnswer}>
                    解答を表示
                </button> :
                <button onClick={onHideAnswer}>
                    解答を非表示
                </button>
            }
        </Stack>
    )
}
