import { useState, useEffect } from 'react'

import type { KifLearningRecord, KifLearningStore } from "../types/kifLearning";
import { useKifLearningPersist } from './useKifLearningPersist';

interface UseKifLearning {
    records: Record<string, KifLearningRecord>;

    getRecord(entryId?: string): KifLearningRecord | undefined;
    markSolved(entryId: string): void;
    markFailed(entryId: string): void;
    reset(entryId: string): void;
};


export function useKifLearning(): UseKifLearning {
    const [records, setRecords] =
        useState<Record<string, KifLearningRecord>>({});
    const persistApi = useKifLearningPersist()

    useEffect(() => {
        persistApi.load().then(setRecords).catch(() => setRecords({}))
    }, []);

    useEffect(() => {
        persistApi.save(records)
    }, [records]);
    const getRecord = (entryId?: string) => {
        if (!entryId) return undefined
        return records[entryId] ?? {
            entryId,
            solvedCount: 0,
            failedCount: 0,
        }
    }

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

    return { records, getRecord, markSolved, markFailed, reset };
}
