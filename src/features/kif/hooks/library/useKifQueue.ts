import { useState, useMemo, useEffect } from "react";

import type { KifEntry } from "../../types";

export function useKifQueue(entries: KifEntry[]) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const entryMap = useMemo(() => {
        const map: Record<string, KifEntry> = {};
        entries.forEach(e => { map[e.id] = e; });
        return map;
    }, [entries]);

    const queue = useMemo(() => entries.map(e => e.id), [entries]);
    // 初期化
    useEffect(() => {
        if (queue.length === 0) {
            resetIndex()
        } else if (currentIndex >= queue.length) {
            resetIndex()
        }
    }, [queue.length, currentIndex])

    // index
    function resetIndex() {
        setCurrentIndex(0)
    }
    function advanceStep() {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1)
        }
    }
    return {
        queue, entryMap,
        currentIndex, resetIndex, advanceStep
    }
}