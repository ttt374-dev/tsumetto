import { Stack, IconButton } from "@mui/material"
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { noFocusVisible } from "../../utils";
import { useSwipeable } from "react-swipeable";

type Props = {
    prevMove: () => void
    nextMove: () => void
    disabled: boolean,
}
export default function MoveControl({ prevMove, nextMove, disabled=false }: Props) {
        // スワイプハンドラ    
    const moveSwipeHandlers = useSwipeable({
        onSwipedUp: () => {
            prevMove()
        },
        onSwipedDown: () => {
            //currentPhase === "problem" && setPhase("solution")
            nextMove()
        },

        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,

    })
    return (
        <Stack {...moveSwipeHandlers} direction="column" justifyContent="center">
            
                <IconButton 
                    sx={noFocusVisible}
                    onClick={prevMove}
                    disabled={disabled}
                >
                    <ExpandLessIcon />
                </IconButton>
                <IconButton 
                    sx={noFocusVisible}
                    onClick={() => { nextMove() }}
                    disabled={disabled}
                >
                    <ExpandMoreIcon />
                </IconButton>
            
        </Stack>)
}