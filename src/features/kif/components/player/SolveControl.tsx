import { useState } from "react";
import { Box, Stack, IconButton } from "@mui/material";
import { calcAccuracy, formatAccuracy } from '../../utils';
import type { KifLearningRecord } from '../../types'
import type { ProblemPhase, ProblemResult } from "../../hooks/player/useProblemProgress";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'


type Props = {
    onSolved: () => void,
    onFailed: () => void,    
}

export default function SolveControl({
    
    onSolved, onFailed, 
}: Props) {
    const [result, setResult] = useState<ProblemResult|null>(null)    
    return (
        <Stack gap={2} margin={2}>           
            
            <Stack gap={2}>
                <Stack direction="row" gap={2}  justifyContent="center">
                    <IconButton
    
                        onClick={onSolved}>
                        <CheckCircleIcon />
                    </IconButton>
                    <IconButton
    
                        onClick={onFailed}>
                        <CloseIcon />
                    </IconButton>            
                </Stack>
            </Stack>
        </Stack>
    )
}