
import { useState, useEffect } from 'react'

import type { KifLearningRecord} from "../../types";
import { useLearningPersist } from './useLearningPersist';
import { scheduleNext } from '../../domain/learning/scheduleNext';

export interface LearningRepositoryApi {
    records: Record<string, KifLearningRecord>;

    findByProblemId(problemId: string | null): KifLearningRecord | null;
    markSolved(entryId: string, answerQuality: number): void;
    markFailed(entryId: string, answerQuality: number): void;
    reset(entryId: string): void;
    replaceAll(records: Record<string, KifLearningRecord>): void;
};

export function useLearningRepository(): LearningRepositoryApi {    
    const [records, setRecords] =
        useState<Record<string, KifLearningRecord>>({});
    const persistApi = useLearningPersist()
   
    useEffect(() => {
        (async () => {
            persistApi.load().then(setRecords).catch((e) =>
            { setRecords({}) }
        )})();
    }, []);


    const findByProblemId = (entryId: string | null): KifLearningRecord | null => {
        if (!entryId) return null
        return records[entryId] ?? {
            entryId,
            solvedCount: 0,
            failedCount: 0,
        }

    }
    const update = (entryId: string, updater: (r: KifLearningRecord) => KifLearningRecord) => {        
        console.log("update", entryId, updater)
        setRecords(prev => {
            const current = prev[entryId] ?? {
                entryId,
                solvedCount: 0,
                failedCount: 0,
            };
            return {
                ...prev,
                [entryId]: updater(current),
            };
        });
        persist()
    };

    function mark(entryId: string, answer: "solved" | "failed", answerQuality: number){
        //const { intervalDays, easeFactor, nextReviewAt} = scheduleNext(r, answerQuality, Date.now())
        update(entryId, r => ({
            ...scheduleNext(r, answerQuality, Date.now()),
            solvedCount: r.solvedCount + ((answer === "solved") ? 1 : 0),
            failedCount: r.failedCount + ((answer === "failed") ? 1 : 0),

        }));
    }

    const markSolved = (entryId: string, answerQuality: number) =>
        mark(entryId, "solved", answerQuality)
        /*
        update(entryId, r => ({
            ...r,
            solvedCount: r.solvedCount + 1,
            lastAnsweredAt: Date.now(),
          
        }));
        */
    

    const markFailed = (entryId: string, answerQuality: number) =>
        mark(entryId, "failed", answerQuality)
        /*
        update(entryId, r => ({
            ...r,
            failedCount: r.failedCount + 1,
            lastAnsweredAt: Date.now(),
          
        }));
        */

    const reset = (entryId: string) => {
        setRecords(prev => {
            const next = { ...prev };
            delete next[entryId];
            return next;
        });
    };
    // 明示的に呼び出す永続化
    const persist = async () => {
        try {
            await persistApi.save(records);
            console.log("KifLearning persisted successfully.");
        } catch (e) {
            console.error("KifLearning persist failed:", e);
        }
    };

    const replaceAll = (records: Record<string, KifLearningRecord>) => {
        setRecords(records)
        persist()
    }

    return { records, findByProblemId, 
        markSolved, markFailed, reset, 
        replaceAll };
}
