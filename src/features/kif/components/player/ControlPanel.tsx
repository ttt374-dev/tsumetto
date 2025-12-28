import { useState } from "react";
import { Box, Divider } from "@mui/material";
import { Stack } from '@mui/material';
import { calcAccuracy, formatAccuracy } from '../../utils';
import type { KifLearningRecord } from '../../types'
import type { ProblemPhase, ProblemResult } from "../../hooks/player/useProblemProgress";
import SolutionControl from "./SolutionControl";
import MoveControl from "./MoveControl";
import ProblemControl from "./ProblemControl";

type Props = {
    navigateTo: (dest: string) => void
    isFirstEntry: () => boolean
    isLastEntity: () => boolean
    currentEntryId: string | null
    
    learningRecord: KifLearningRecord | null
    currentPhase: ProblemPhase

    markSolved: (entryId: string) => void
    markFailed: (entryId: string) => void
    chooseResult: (result: ProblemResult) => void
    
    prevMove: () => void
    nextMove: () => void
    setPhase: (phase: ProblemPhase) => void
    setCurrentIndex: (index: number) => void
}
export default function ControlPanel({
    prevMove, nextMove, setPhase,
    currentPhase, setCurrentIndex,
    currentEntryId, chooseResult,
        
    learningRecord,
    markSolved, markFailed,
    isLastEntity, navigateTo,
    
}: Props){
    return (<Stack direction="column" divider={<Divider />}>
        { /* 
        <SolutionControl
            prevMove={prevMove}
            nextMove={nextMove}
            setPhase={setPhase}
            currentPhase={currentPhase}
            setCurrentIndex={setCurrentIndex}
        />
        */}
        <MoveControl
            prevMove={prevMove}
            nextMove={nextMove}
        />

        {learningRecord && currentEntryId &&
            <ProblemControl
                currentEntryId={currentEntryId}
                learningRecord={learningRecord}
                currentPhase={currentPhase}
                markSolved={markSolved}
                markFailed={markFailed}
                chooseResult={chooseResult}
                isLastEntity={isLastEntity}
                navigateTo={navigateTo}
            />
        }
    </Stack>)
}