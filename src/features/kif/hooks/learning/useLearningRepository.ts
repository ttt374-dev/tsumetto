
import { useState, useEffect } from 'react'

import type { KifLearningRecord} from "../../types";
import { useLearningPersist } from './useLearningPersist';
import { SettingsInputAntennaTwoTone } from '@mui/icons-material';

type Solution = "solved" | "failed"

export interface LearningRepositoryApi {
    records: Record<string, KifLearningRecord>;

    findByProblemId(problemId: string | null): KifLearningRecord | null;
    //getLearningRecord(entryId: string | null): KifLearningRecord | null;
    mark(problemId: string, solution: Solution): void;
    markSolved(entryId: string): void;
    markFailed(entryId: string): void;
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
        )
            
        })();
    }, []);


    const get = (entryId: string | null) => {
        if (!entryId) return null
        return records[entryId] ?? {
            entryId,
            solvedCount: 0,
            failedCount: 0,
        }
    }
    const findByProblemId = (problemId: string | null): KifLearningRecord | null => {
        return get(problemId)
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

    function mark(problemId: string, solution: Solution){
        const solved = solution === 'solved' ? 1 : 0
        const failed = solution === 'failed' ? 1 : 0
        update(problemId, r => ({
            ...r,
            solvedCount: r.solvedCount + solved,
            failedCount: r.failedCount + failed,
            lastAnsweredAt: Date.now(),
        }));
    }
    function markSolved(entryId: string){        
        update(entryId, r => ({
            ...r,
            solvedCount: r.solvedCount + 1,
            lastAnsweredAt: Date.now(),
        }));
    }

    const markFailed = (entryId: string) =>
        update(entryId, r => ({
            ...r,
            failedCount: r.failedCount + 1,
            lastAnsweredAt: Date.now(),
        }));

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
        mark, markSolved, markFailed, reset, 
        replaceAll };
}
