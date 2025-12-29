import { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";

import type { KifEntry, QueueItem, AnswerResult, PlayerSession } from "../../types";
import { createEmptyBoard, createEmptyHands } from "../../domain/factory";
import { useKifReplay } from "./useKifReplay";
import { useLearningRepository } from "../learning/useLearningRepository";
import { useKifPhase } from "./useKifPhase";
import { calcAccuracy } from "../../utils";
import { useQueueResult } from "../session/useQueueResult";


export function useKifPlayer(
    //queue: QueueItem[], 
    playerSession: PlayerSession | null,
    entryMap: Record<string, KifEntry>,
    //onFinish: () => void,
){
    //const [currentIndex, setCurrentIndex] = useState(0)
    const { entryId: entryIdFromRoute } = useParams<{ entryId: string }>();
    
    //const queue: QueueItem[] = playerSession?.queue ?? []
    
    // 初期化
    //  インデックスが変われば中身をリセット
    useEffect(()=>{      
        reset()
    }, [playerSession?.queue, playerSession?.currentIndex, entryMap])
    // ルートパラメータに entryId があれば、queue 内の位置を currentIndex に設定
    { /* 
    useEffect(() => {
        if (entryIdFromRoute) {
            const idx = queue.findIndex(item => item.problemId === entryIdFromRoute) 
            if (idx !== -1) setCurrentIndex(idx);

            else setCurrentIndex(0); // 見つからなければ先頭
        } else {
            resetIndex()
        }
    }, [entryIdFromRoute, queue]);
    */ }
    
    // step index
    function resetIndex() {
       // setCurrentIndex(0)
    }
    
    const currentEntryId = playerSession?.queue[playerSession.currentIndex].problemId ?? null;
    const currentEntry = currentEntryId ? entryMap[currentEntryId] ?? null : null;
    
    const kifInfo = {
            initialBoard: currentEntry?.kifData.board ?? createEmptyBoard(),
            initialHands: currentEntry?.kifData.hands ?? createEmptyHands(),
            events: currentEntry?.kifData.events ?? [],
            title: currentEntry?.title ?? "untitled",
            entryId: currentEntry?.id ?? ""
        }
    const queueInfo = {
        //queue, entryMap,
        //currentIndex: playerSession.currentIndex,
    }
    const replayInfo = useKifReplay(
            kifInfo.initialBoard, kifInfo.initialHands, kifInfo.events,
        )

    const kifLearning = useLearningRepository()
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
        setCurrentAnswer: (answer: AnswerResult) => { 
            currentEntryId && setAnswer(currentEntryId, answer)},
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