import { useState } from "react";
import { Box } from "@mui/material";
import { Stack } from '@mui/material';
import { calcAccuracy, formatAccuracy } from '../../utils';
import type { KifLearningRecord } from '../../types'
import type { ProblemPhase, ProblemResult } from "../../hooks/player/useProblemProgress";

type ProblemStatsProps = {
    learningRecord: KifLearningRecord
}
function ProblemStats({ learningRecord }: ProblemStatsProps) {
    return (
        <Box>
            {formatAccuracy(calcAccuracy(learningRecord))}
            [{learningRecord.solvedCount} | {learningRecord.failedCount}]
        </Box>
    )
}

type Props = {
    currentEntryId: string
    learningRecord: KifLearningRecord
    currentPhase: ProblemPhase

    markSolved: (entryId: string) => void
    markFailed: (entryId: string) => void
    chooseResult: (result: ProblemResult) => void

    nextEntryAvailable: (entryId: string) => boolean
    navigateTo: (dest: string) => void
}

export function ProblemControl({
    learningRecord, currentPhase, currentEntryId,
    markSolved, markFailed, chooseResult,
    nextEntryAvailable, navigateTo
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

    return (
        <Stack gap={2} margin={2} direction="column">
            <ProblemStats learningRecord={learningRecord}/>
            
            <Stack gap={2}>
                <Stack direction="row" gap={2}>
                    <button onClick={handleSolved} disabled={currentPhase != "solution"}>
                        正答
                    </button>
                    <button onClick={handleFailed} disabled={currentPhase != "solution"}>
                        誤答
                    </button>
                </Stack>

            </Stack>

            {currentPhase === 'result' &&
                <Box>
                    {result === 'solved' ? '正解!' : '残念'}
                    <button onClick={() => navigateTo("next")}
                        disabled={
                            !nextEntryAvailable(currentEntryId ?? "") ||
                            currentPhase != "result"
                        }>
                        次の問題へ
                    </button>
                </Box>
            }

        </Stack>
    )
}