// features/kif/hooks/useSortedEntries.ts
import { useMemo } from "react"
import type { DeckFilter, KifEntry, KifLearningRecord, SortState } from "../../types"


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

    function matchesText(entry: KifEntry, text?: string): boolean {
        if (!text) return true;
        const t = text.toLowerCase();
        return (
            entry.title?.toLowerCase().includes(t) 
//            entry.description?.toLowerCase().includes(t)
        );
    }


    const filteredEntries = useMemo(() => {
        const now = Date.now();

        return entries.filter(entry => {
            const record = learningRecords[entry.id];

            // 未回答のみ
            if (filter.unansweredOnly && !isUnansweredRecord(record)) {
                return false;
            }

            // 次回レビュー対象のみ
            if (
                filter.dueOnly &&                
                record?.nextReviewedAt !== undefined &&
                record.nextReviewedAt > now
            ) {
                return false;
            }
            // text
            if (!matchesText(entry, filter.text)) {
                return false;
            }
            return true;
        });
    }, [entries, learningRecords, filter]);

    return filteredEntries;
    /*
    const unansweredEntries = useMemo(() => {
        return entries.filter(entry => {
            const record = learningRecords[entry.id]
            return isUnansweredRecord(record);
        });
    }, [entries, learningRecords, filter]);
    console.log("unanswereEntries", unansweredEntries, filter)
    if (filter.unansweredOnly) return unansweredEntries
    else return entries
    */

}
