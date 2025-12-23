import { useState, useEffect } from 'react'

import type { KifLearningRecord} from "../../types/";
import { useKifLearningPersist } from './useKifLearningPersist';

interface UseKifLearning {
    records: Record<string, KifLearningRecord>;

    getRecord(entryId: string | null): KifLearningRecord | null;
    markSolved(entryId: string): void;
    markFailed(entryId: string): void;
    reset(entryId: string): void;
    replaceAll(records: Record<string, KifLearningRecord>): void;
};


export function useKifLearning(): UseKifLearning {
    const [records, setRecords] =
        useState<Record<string, KifLearningRecord>>({});
    const persistApi = useKifLearningPersist()

    const getRecord = (entryId: string | null) => {
        if (!entryId) return null
        return records[entryId] ?? {
            entryId,
            solvedCount: 0,
            failedCount: 0,
        }
    }

    useEffect(() => {
        (async () => {
            persistApi.load().then(setRecords).catch((e) =>
            { setRecords({}) }
        )
            
        })();
    }, []);


    const update = (entryId: string, updater: (r: KifLearningRecord) => KifLearningRecord) => {
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

    const markSolved = (entryId: string) =>
        update(entryId, r => ({
            ...r,
            solvedCount: r.solvedCount + 1,
            lastAnsweredAt: Date.now(),
        }));

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

    return { records, getRecord, markSolved, markFailed, reset, replaceAll };
}
