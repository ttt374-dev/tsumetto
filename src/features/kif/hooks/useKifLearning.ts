import { useState, useEffect } from 'react'

import type { KifLearningRecord, KifLearningStore } from "../types/kifLearning";
import { useKifLearningPersist } from './useKifLearningPersist';

interface UseKifLearning {
    records: Record<string, KifLearningRecord>;

    getRecord(entryId?: string): KifLearningRecord | null;
    markSolved(entryId: string): void;
    markFailed(entryId: string): void;
    reset(entryId: string): void;
};


export function useKifLearning(): UseKifLearning {
    const [records, setRecords] =
        useState<Record<string, KifLearningRecord>>({});
    const persistApi = useKifLearningPersist()

    useEffect(() => {
        console.log("kif learning: initial useeffect")
        persistApi.load().then((r) => {
            Object.entries(r).forEach(([key, value]) => {
                console.log(`Loaded record key: ${key}`, value);
            });
            setRecords(r)
        }
        )
        .catch((e) => {
            console.error("KifLearning load failed:", e)
            setRecords({})
        }
    )
    }, []);


    const getRecord = (entryId: string) => {
        if (!entryId) return null
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

    return { records, getRecord, markSolved, markFailed, reset };
}
