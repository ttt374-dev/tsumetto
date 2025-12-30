import { useEffect } from "react";
import { useParams } from "react-router-dom";

import type { KifEntry, PlayerSession } from "../../types";
import { createEmptyBoard, createEmptyHands, createKifData, createKifEntry } from "../../domain/factory";
import { useKifReplay } from "./useKifReplay";
import { useLearningRepository, type LearningRepositoryApi } from "../learning/useLearningRepository";
import { useKifPhase } from "./useKifPhase";
import { calcAccuracy } from "../../utils";
import { useQueueResult } from "../session/useQueueResult";

export function useKifPlayer(
    //queue: QueueItem[], 
    session: PlayerSession | null,
    entryMap: Record<string, KifEntry>,
    learningRepository: LearningRepositoryApi,){
    
    const { entryId: problemIdFromParams } = useParams<{ entryId: string }>();
    
    // 初期化
    //  インデックスが変われば中身をリセット
    useEffect(()=>{      
        reset()
    }, [session?.queue, session?.currentPlyIndex, entryMap])

    const queueItem = session && session.queue[session.currentPlyIndex]
    const problemIdFromSession = queueItem?.problemId
    //const currentEntryId = playerSession?.queue[playerSession.currentPlyIndex].problemId ?? null;
    // ルートパラメータに entryId があればそれを使用。なければセッションから取り出す
    const currentEntryId = problemIdFromParams ?? problemIdFromSession ?? null
    const currentEntry = currentEntryId ? entryMap[currentEntryId] ?? null : null;
    //console.log("current entryid", currentEntryId, problemIdFromParams, problemIdFromSession)
    
    const currentProblem = currentEntry ?? createKifEntry()
    const kifContent = currentProblem.kifData

    const moves = kifContent.events.filter(e => e.type === "move")
    const replayApi = useKifReplay(
            kifContent.board, kifContent.hands, moves,
    
        )
    
    const { findByProblemId } = learningRepository
    
    const learningRecord = findByProblemId(currentEntryId)
    const learningApi = {
        learningRecord: learningRecord,
        accuracy: calcAccuracy(learningRecord ?? undefined),
        solvedCount: learningRecord?.solvedCount ?? 0,
        failedCount: learningRecord?.failedCount ?? 0,
        markSolvedCurrent: () => { 
            currentEntryId && learningRepository.markSolved(currentEntryId)},
        markFailedCurrent: () => { 
            currentEntryId && learningRepository.markFailed(currentEntryId)}
    }
    /*
    const { resultMap, setAnswer, summary, } = useQueueResult()
    const queueResultInfo = {
        queueResultMap: resultMap,
        setCurrentAnswer: (answer: AnswerResult) => { 
            currentEntryId && setAnswer(currentEntryId, answer)},
        summary
    }*/
    function reset(){
        replayApi.reset()
        phaseInfo.reset()                
    }
    const phaseInfo = useKifPhase()
    

    ////////////////////
    return {
        currentProblem: currentProblem,
        replayApi: replayApi,               
        phaseApi: phaseInfo,
        learnApi: learningApi,
    }
}