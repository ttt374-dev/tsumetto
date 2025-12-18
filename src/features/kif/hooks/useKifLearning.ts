import { useState, useEffect } from 'react'
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import type { KifLearningRecord, KifLearningStore } from "../types/kifLearning";

interface UseKifLearning {
    records: Record<string, KifLearningRecord>;

    getRecord(entryId: string | null): KifLearningRecord | null;

    markSolved(entryId: string): void;
    markFailed(entryId: string): void;

    reset(entryId: string): void;
};

const LEARNING_FILE = "kif-learning.json";


export function useKifLearning(): UseKifLearning {
    const [records, setRecords] =
        useState<Record<string, KifLearningRecord>>({});

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
            try {
                const result = await Filesystem.readFile({
                    path: LEARNING_FILE,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });

                const text =
                    typeof result.data === "string"
                        ? result.data
                        : await result.data.text();

                const parsed: unknown = JSON.parse(text);

                if (
                    typeof parsed === "object" &&
                    parsed !== null &&
                    (parsed as any).version === 1 &&
                    typeof (parsed as any).records === "object"
                ) {
                    setRecords((parsed as KifLearningStore).records);
                } else {
                    setRecords({});
                }
            } catch {
                // 初回起動 or 壊れている
                setRecords({});
            }
        })();
    }, []);

    useEffect(() => {
        const store: KifLearningStore = {
            version: 1,
            records,
        };

        Filesystem.writeFile({
            path: LEARNING_FILE,
            directory: Directory.Data,
            data: JSON.stringify(store),
            encoding: Encoding.UTF8,
        }).catch(() => {
            // 保存失敗してもアプリは止めない
        });
    }, [records]);

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
