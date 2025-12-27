import { useState } from "react";
import { Box, Stack, IconButton } from "@mui/material";
import { calcAccuracy, formatAccuracy } from '../../utils';
import type { KifLearningRecord } from '../../types'
import type { ProblemPhase, ProblemResult } from "../../hooks/player/useProblemProgress";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'


type ProblemStatsProps = {
    learningRecord: KifLearningRecord
}
function ProblemStats({ learningRecord }: ProblemStatsProps) {
    return (
        <Stack gap={1}>
            {formatAccuracy(calcAccuracy(learningRecord))}
            [{learningRecord.solvedCount} | {learningRecord.failedCount}]
        </Stack>
    )
}

type Props = {
    currentEntryId: string
    learningRecord: KifLearningRecord
    currentPhase: ProblemPhase

    markSolved: (entryId: string) => void
    markFailed: (entryId: string) => void
    chooseResult: (result: ProblemResult) => void

    isLastEntity: () => boolean
    navigateTo: (dest: string) => void
}

export default function ProblemControl({
    learningRecord, currentPhase, currentEntryId,
    markSolved, markFailed, chooseResult,
    isLastEntity, navigateTo
}: Props) {
    const [result, setResult] = useState<ProblemResult|null>(null)
    const handleSolved = () => {
        currentEntryId && markSolved(currentEntryId);
        chooseResult("solved")
        setResult("solved")
        //setSolveState(prev => ({...prev, phase: "result", selectedResult: "solved"}))
        //navigateTo("next")
    }
    const handleFailed = () => {
        currentEntryId && markFailed(currentEntryId)
        chooseResult("failed")
        setResult("failed")
        //setSolveState(prev => ({...prev, phase: "result", selectedResult: "failed"}))
        //navigateTo("next")
    }

    const disabled = currentPhase != "solution"
    return (
        <Stack gap={2} margin={2}>
            <ProblemStats learningRecord={learningRecord}/>
            
            <Stack gap={2}>
                <Stack direction="row" gap={2}  justifyContent="center">
                    <IconButton
                        disabled={disabled}
                        onClick={handleSolved}>
                        <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                        disabled={disabled}
                        onClick={handleFailed}>
                        <CloseIcon />
                    </IconButton>
            { /* 
                    <button onClick={handleSolved} disabled={disabled}>
                        正答
                    </button>
                    <button onClick={handleFailed} disabled={disabled}>
                        誤答
                    </button>
                    */ }
                </Stack>

            </Stack>

            {currentPhase === 'result' &&
                <Box>
                    {result === 'solved' ? '正解!' : '残念'}
                    <button onClick={() => navigateTo("next")}
                        disabled={
                            isLastEntity() ||
                            currentPhase != "result"
                        }>
                        次の問題へ
                    </button>
                </Box>
            }

        </Stack>
    )
}