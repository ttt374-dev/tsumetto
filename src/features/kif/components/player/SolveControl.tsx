import { useState } from "react";
import { Box, Stack, IconButton } from "@mui/material";
import { calcAccuracy, formatAccuracy } from '../../utils';
import type { KifLearningRecord } from '../../types'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'

export type PlayerResult = "solved" | "failed" | null

type Props = {
    onSolved: () => void,
    onFailed: () => void,
    disabled?: boolean    
}

export default function SolveControl({    
    onSolved, onFailed, disabled=false,
}: Props) {
    const [result, setResult] = useState<PlayerResult|null>(null)    
    return (
        <Stack gap={2} margin={2}>           
            
            <Stack gap={2}>
                <Stack direction="row" gap={2}  justifyContent="center">
                    <IconButton
                        onClick={onSolved}
                        disabled={disabled}
                    >
                        <CheckCircleIcon />
                    </IconButton>
                    <IconButton    
                        onClick={onFailed}
                        disabled={disabled}
                    >
                        <CloseIcon />
                    </IconButton>            
                </Stack>
            </Stack>
        </Stack>
    )
}