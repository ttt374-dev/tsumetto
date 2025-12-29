import { useState, useMemo, useEffect, } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Stack, Divider } from '@mui/material';
import ViewListIcon from "@mui/icons-material/ViewList";
import { useSwipeable } from "react-swipeable";

import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import EventsView from '../components/player/EventsView';
import MoveControl from '../components/player/MoveControl';
import SolutionControl from '../components/player/SolutionControl';
import BoardView from "../components/player/BoardView";
import SolveControl from "../components/player/SolveControl";
import { formatAccuracy } from "../utils";
import { useKifPlayer } from "../hooks/player/useKifPlayer";
import type { AnswerResult } from "../hooks/useQueueResult";
import { Apple } from "@mui/icons-material";

export default function SummaryScreen(){
    const location = useLocation();
    const { queue, queueResultMap } = location.state as {
        queue: string[];
        queueResultMap: Record<string, AnswerResult>
    };
    const stats = useMemo(() => {
        return queue.reduce(
            (acc, id) => {
                const r = queueResultMap[id];
                if (r === "correct") acc.correct++;
                else if (r === "wrong") acc.wrong++;
                else acc.skipped++;
                return acc;
            },
            { correct: 0, wrong: 0, skipped: 0 }
        );
    }, [queue, queueResultMap]);
    const navigate = useNavigate()
    return (
    <AppLayout header={"Queue Result"}>
        <>
            { `${stats.correct} | ${stats.wrong}` }
            <button onClick={() => navigate("/deck")}>
                デッキに戻る
            </button>
        </>
        
    </AppLayout>)
}