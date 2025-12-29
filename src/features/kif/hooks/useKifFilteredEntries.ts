// features/kif/hooks/useSortedEntries.ts
import { useMemo } from "react"
import type { DeckFilter, KifEntry, KifLearningRecord, SortState } from "../types"
import { useKifSortedEntries } from "./library/useKifSortedEntries"


function isUnansweredRecord(
    record: { solvedCount: number; failedCount: number } | null
): boolean {
    if (!record) return true;
    return record.solvedCount + record.failedCount === 0;
}

export function useKifFilteredEntries(
    entries: KifEntry[],
    learningRecords: Record<string, KifLearningRecord>,
    filter: DeckFilter

): KifEntry[] {
    const unansweredEntries = useMemo(() => {
        return entries.filter(entry => {
            const record = learningRecords[entry.id]
            return isUnansweredRecord(record);
        });
    }, [entries, learningRecords, filter]);

    if (filter.unansweredOnly) return unansweredEntries
    else return entries
}
