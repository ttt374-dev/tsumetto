import { useState, useMemo, useEffect } from "react";

import type { KifEntry } from "../../types";
import { createEmptyBoard, createEmptyHands } from "../../domain/factory";
import { useKifReplay } from "./useKifReplay";
import { useKifLearning } from "../learning/useKifLearning";
import { useKifPhase } from "./useKifPhase";
import { useKifQueue } from "../library/useKifQueue";

export function useKifPlayer(sortedEntries: KifEntry[]){
    // queue
    const { queue, entryMap, 
        currentIndex, resetIndex, advanceStep 
    } = useKifQueue(sortedEntries)
    
    // ** 暫定的に entryid を使用
    const currentEntryId =
        currentIndex >= 0 && currentIndex < queue.length
            ? queue[currentIndex]
            : null;

    const currentEntry = useMemo(() => {
        if (!currentEntryId) return null;
        return entryMap[currentEntryId] ?? null;
    }, [currentEntryId, entryMap]);
    
    // phase
    
    // 初期化
    useEffect(()=>{      
        reset()
    }, [sortedEntries, currentEntryId])
    
    const kifInfo = {
            initialBoard: currentEntry?.kifData.board ?? createEmptyBoard(),
            initialHands: currentEntry?.kifData.hands ?? createEmptyHands(),
            events: currentEntry?.kifData.events ?? [],
            title: currentEntry?.title ?? "untitled",
        }
    const queueInfo = {
        queue,
        currentIndex,
        advanceStep,
    }
    const replay = useKifReplay(
            kifInfo.initialBoard, kifInfo.initialHands, kifInfo.events, currentEntryId)

    const kifLearning = useKifLearning()
    const { getLearningRecord } = kifLearning
    
    const learningRecord = getLearningRecord(currentEntryId)
    const learningInfo = {
        solvedCount: learningRecord?.solvedCount ?? 0,
        failedCount: learningRecord?.failedCount ?? 0,
        markSolvedCurrent: () => { currentEntryId && kifLearning.markSolved(currentEntryId)},
        markFailedCurrent: () => { currentEntryId && kifLearning.markFailed(currentEntryId)}
    }
    function reset(){
        replay.reset
        phaseInfo.reset
        resetIndex
    }
    const phaseInfo = useKifPhase()
    

    ////////////////////
    return {
        // static
        kifInfo: kifInfo,
        // queue
        queueInfo: queueInfo,
        // replay
        replayInfo: replay,               
        // phase
        phaseInfo: phaseInfo,

        learnInfo: learningInfo
    }
}