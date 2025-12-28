import { useState, useEffect, useMemo } from "react";
import type { KifEntry, KifProblem } from "../types";
import { createEmptyBoard, createEmptyHand, createEmptyHands } from "../domain/factory";

export function useKifNavigation(sortedEntries: KifEntry[]) {
    //const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0)
    const queue = useMemo(
        () => sortedEntries.map(e => e.id),
        [sortedEntries]
    )

    useEffect(() => {
        if (queue.length === 0) {
            setCurrentIndex(0);
        } else if (currentIndex >= queue.length) {
            setCurrentIndex(0);
        }
    }, [queue.length, currentIndex])


    // id → entry のマップ（library から生成される想定）
    const entryMap: Record<string, KifEntry> = useMemo(() => {
        const map: Record<string, KifEntry> = {};
        sortedEntries.forEach(e => {
            map[e.id] = e;
        });
        return map;
    }, [sortedEntries]);
    
    const currentEntryId =
        currentIndex >= 0 && currentIndex < queue.length
            ? queue[currentIndex]
            : null;

    const currentEntry = useMemo(() => {
        if (!currentEntryId) return null;
        return entryMap[currentEntryId] ?? null;
    }, [currentEntryId, entryMap]);

    function advanceStep(){
        if (queue.length === 0) return;
        setCurrentIndex(0);

    }

    // ナビゲーター
    // deplicated
    const navigateTo = (dest: string) => {
        //if (!currentEntryId) return;       

        switch (dest) {
            case 'first':
                if (queue.length === 0) return;
                setCurrentIndex(0);
                break;
            case 'prev':
                if (queue.length === 0) return;
                setCurrentIndex((i) => Math.max(i - 1, 0));
                break;
            case 'next':
                if (queue.length === 0) return;
                setCurrentIndex((i) => Math.min(i + 1, queue.length - 1)); break;
            case 'last':
                if (queue.length === 0) return;
                setCurrentIndex(queue.length - 1);
                break;
            default:
                break;
        }
    }
    function isLastEntry(): boolean {
        return (
            queue.length > 0 &&
            currentIndex === queue.length - 1
        );
    }
    function isFirstEntry(): boolean {
        return queue.length > 0 && currentIndex === 0;
    }
    function setCurrentEntryId(entryId: string) {
        const index = queue.indexOf(entryId)
        if (index === -1) return
        setCurrentIndex(index);

    }
    return {
        currentEntryId,
        currentEntry,
        setCurrentEntryId,
        navigateTo,
        isLastEntry,
        isFirstEntry,
    }


}
