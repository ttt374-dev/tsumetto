import { Stack, IconButton } from "@mui/material"
import type { ProblemPhase } from "../../hooks/player/useProblemProgress"
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { noFocusVisible } from "../../utils";

type Props = {
    prevMove: () => void
    nextMove: () => void
    setPhase: (phase: ProblemPhase) => void
}
export default function MoveControl({ prevMove, nextMove, setPhase }: Props) {
    return (
        <Stack direction="column">
            <>
                <IconButton sx={noFocusVisible} onClick={prevMove}>
                    <ExpandLessIcon />
                </IconButton>
                <IconButton sx={noFocusVisible}
                    onClick={() => { setPhase("solution"); nextMove() }}>
                    <ExpandMoreIcon />
                </IconButton>
            </>
        </Stack>)
}