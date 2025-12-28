import { useState, useMemo, useEffect } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Stack, Divider } from '@mui/material';

import type { KifEntry } from "../../types";
import { createEmptyBoard, createEmptyHands } from "../../domain/factory";
import { useKifReplay } from "./useKifReplay";
import { useKifLearning } from "../learning/useKifLearning";
import { useKifPhase } from "./useKifPhase";

export function useKifPlayer(sortedEntries: KifEntry[]){
    // queue
    const [currentIndex, setCurrentIndex] = useState(0)
    const queue = useMemo(
            () => sortedEntries.map(e => e.id),
            [sortedEntries]
        )
    function advanceStep(){
        if (currentIndex < queue.length - 1){
            setCurrentIndex(prev => prev + 1)
        }
    }
    // id → entry のマップ（library から生成される想定）
    const entryMap: Record<string, KifEntry> = useMemo(() => {
        const map: Record<string, KifEntry> = {};
        sortedEntries.forEach(e => {
            map[e.id] = e;
        });
        return map;
    }, [sortedEntries]);

    // ** 暫定的に entryid を使用
    const currentEntryId =
        currentIndex >= 0 && currentIndex < queue.length
            ? queue[currentIndex]
            : null;

    const currentEntry = useMemo(() => {
        if (!currentEntryId) return null;
        return entryMap[currentEntryId] ?? null;
    }, [currentEntryId, entryMap]);

    // 初期化
    useEffect(()=>{        
    }, [sortedEntries, currentEntryId])

    // phase
    //const { currentPhase, setPhase} = useProblemProgress(currentEntryId)
    useEffect(() => {
        if (queue.length === 0) {
            setCurrentIndex(0);
        } else if (currentIndex >= queue.length) {
            setCurrentIndex(0);
        }
    }, [queue.length, currentIndex])

    
    const kifInfo = {
            initialBoard: currentEntry?.kifData.board ?? createEmptyBoard(),
            initialHands: currentEntry?.kifData.hands ?? createEmptyHands(),
            events: currentEntry?.kifData.events ?? [],
            title: currentEntry?.title ?? "untitled",
        }
    const queueInfo = {
        queue,
        currentIndex,
        advanceStep,
    }
    const replay = useKifReplay(
            kifInfo.initialBoard, kifInfo.initialHands, kifInfo.events, currentEntryId)

    const kifLearning = useKifLearning()
    const { getLearningRecord } = kifLearning
    
    const learningRecord = getLearningRecord(currentEntryId)
    const learningInfo = {
        solvedCount: learningRecord?.solvedCount ?? 0,
        failedCount: learningRecord?.failedCount ?? 0,
        markSolvedCurrent: () => { currentEntryId && kifLearning.markSolved(currentEntryId)},
        markFailedCurrent: () => { currentEntryId && kifLearning.markFailed(currentEntryId)}
    }
    
    ////////////////////
    return {
        // static
        kifInfo: kifInfo,
        // queue
        queueInfo: queueInfo,
        // replay
        replayInfo: replay,               
        // phase
        phaseInfo: useKifPhase(),

        learnInfo: learningInfo
    }
}