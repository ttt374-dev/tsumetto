import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";

import type { KifEntry } from "../../types";
import { createEmptyBoard, createEmptyHands } from "../../domain/factory";
import { useKifReplay } from "./useKifReplay";
import { useKifLearning } from "../learning/useKifLearningRepository";
import { useKifPhase } from "./useKifPhase";
import { calcAccuracy } from "../../utils";
import { useQueueResult } from "../useQueueResult";
import type { AnswerResult } from "../useQueueResult";

export function useKifPlayer(
    queue: string[], 
    entryMap: Record<string, KifEntry>,
    onFinish: () => void,
){
    const [currentIndex, setCurrentIndex] = useState(0)
    const { entryId: entryIdFromRoute } = useParams<{ entryId: string }>();
    
    
    // 初期化
    //  インデックスが変われば中身をリセット
    useEffect(()=>{      
        reset()
    }, [currentIndex, queue, entryMap])
    // ルートパラメータに entryId があれば、queue 内の位置を currentIndex に設定
    useEffect(() => {
        if (entryIdFromRoute) {
            const idx = queue.indexOf(entryIdFromRoute);                        
            if (idx !== -1) setCurrentIndex(idx);

            else setCurrentIndex(0); // 見つからなければ先頭
        } else {
            resetIndex()
        }
    }, [entryIdFromRoute, queue]);

    // step index
    function resetIndex() {
        setCurrentIndex(0)
    }
    function advanceStep() {
        if (currentIndex < queue.length - 1) {
           
            setCurrentIndex(prev => prev + 1)
        } else {
            onFinish?.()
        }
    }
    function retreatStep() {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1)
        }
    }
    const currentEntryId = queue[currentIndex] ?? null;
    const currentEntry = currentEntryId ? entryMap[currentEntryId] ?? null : null;
   
    
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
        advanceStep, retreatStep,
    }
    const replayInfo = useKifReplay(
            kifInfo.initialBoard, kifInfo.initialHands, kifInfo.events,
        )

    const kifLearning = useKifLearning()
    const { getLearningRecord } = kifLearning
    
    const learningRecord = getLearningRecord(currentEntryId)
    const learningInfo = {
        learningRecord: learningRecord,
        accuracy: calcAccuracy(learningRecord ?? undefined),
        solvedCount: learningRecord?.solvedCount ?? 0,
        failedCount: learningRecord?.failedCount ?? 0,
        markSolvedCurrent: () => { currentEntryId && kifLearning.markSolved(currentEntryId)},
        markFailedCurrent: () => { currentEntryId && kifLearning.markFailed(currentEntryId)}
    }
    const { resultMap, setAnswer, summary, } = useQueueResult()
    const queueResultInfo = {
        queueResultMap: resultMap,
        setCurrentAnswer: (answer: AnswerResult) => { setAnswer(currentEntryId, answer)},
        summary
    }
    function reset(){
        replayInfo.reset()
        phaseInfo.reset()                
    }
    const phaseInfo = useKifPhase()
    

    ////////////////////
    return {
        kifInfo: kifInfo,
        queueInfo: queueInfo,
        replayInfo: replayInfo,               
        phaseInfo: phaseInfo,
        learnInfo: learningInfo,
        queueResultInfo: queueResultInfo,
    }
}