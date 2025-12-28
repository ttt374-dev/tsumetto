import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";

import type { KifEntry } from "../../types";
import { createEmptyBoard, createEmptyHands } from "../../domain/factory";
import { useKifReplay } from "./useKifReplay";
import { useKifLearning } from "../learning/useKifLearning";
import { useKifPhase } from "./useKifPhase";

export function useKifPlayer(queue: string[], entryMap: Record<string, KifEntry>){
    const [currentIndex, setCurrentIndex] = useState(0)
    const { entryId: entryIdFromRoute } = useParams<{ entryId: string }>();
    
    // queue
   // 初期化
    useEffect(() => {
        if (queue.length === 0) {
            resetIndex()
        } else if (currentIndex >= queue.length) {
            resetIndex()
        }
    }, [queue.length, currentIndex])

    // ルートパラメータに entryId があれば、queue 内の位置を currentIndex に設定
    useEffect(() => {
        if (entryIdFromRoute) {
            const idx = queue.indexOf(entryIdFromRoute);                        
            if (idx !== -1) setCurrentIndex(idx);

            else setCurrentIndex(0); // 見つからなければ先頭
        } else {
            setCurrentIndex(0);
        }
    }, [entryIdFromRoute, queue]);
    // index
    function resetIndex() {
        setCurrentIndex(0)
    }
    function advanceStep() {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }
    // ** 暫定的に entryid を使用 (learning db 用)
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
    }, [currentIndex, queue, entryMap])
    
    const kifInfo = {
            initialBoard: currentEntry?.kifData.board ?? createEmptyBoard(),
            initialHands: currentEntry?.kifData.hands ?? createEmptyHands(),
            events: currentEntry?.kifData.events ?? [],
            title: currentEntry?.title ?? "untitled",
            entryId: currentEntry?.id ?? ""
        }
    const queueInfo = {
        queue, entryMap,
        currentIndex, setCurrentIndex,
        advanceStep,
    }
    const replay = useKifReplay(
            kifInfo.initialBoard, kifInfo.initialHands, kifInfo.events,

        )

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
        kifInfo: kifInfo,
        queueInfo: queueInfo,
        replayInfo: replay,               
        phaseInfo: phaseInfo,
        learnInfo: learningInfo
    }
}