import { useState, useMemo, useEffect } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import { Stack, Divider } from '@mui/material';

import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import EventsView from '../components/player/EventsView';
import { formatAccuracy } from "../utils";
import { useKifPlayer } from "../hooks/player/useKifPlayer";
import type { PlayerPhase } from "../hooks/player/useKifPhase";
import type { JSX } from "react";
import { BoardPanel } from "../components/player/BoardPanel";
import type { QueueItem } from "../types";

///////////////////////////////////////
export default function PlayerScreen() {
    //const [result, setResult] = useState<boolean | null>(false)
    
    const navigate = useNavigate()

    //const { queue, entryMap, playerSession } = useKif()
    const { problemMap, playerSessionApi } = useKif()
    const { session, isFinished,
        advance: advanceStep, retreat: retreatStep, 
    } = playerSessionApi
    const queue: QueueItem[] = session?.queue ?? []
    const currentIndex = session?.currentIndex

    console.log("player session", playerSessionApi) 
   
    const {
        kifInfo: {
            events, title,
        },
        queueInfo: {
            //currentIndex, 
        },
        replayInfo: {
            board, hands,
            currentEventIndex, setCurrentEventIndex,
            retreatEvent, advanceEvent,
        },
        phaseInfo: {
            currentPhase,
            advancePhase, retreatPhase
        },
        learnInfo: {
            solvedCount, failedCount, accuracy,
            markSolvedCurrent, markFailedCurrent
        },
        queueResultInfo: {
            setCurrentAnswer, queueResultMap,
            summary: queueResultSummary,
        }
    } = useKifPlayer(session, problemMap)

const handleFinish = () => {
        if (isFinished){
        //if (currentIndex == queue.length - 1) {  // 最後の問題
            navigate("/summary", { state: { queue, queueResultMap } })
        }
    }
    
    
    //const showMove = currentPhase !== "problem"
    //useEffect(() => { setResult(null) }, [currentIndex])
    
    ////////////////////
    // フッターのアクションボタン
    const phaseActions: Record<PlayerPhase, JSX.Element> = {
        problem: (
            <Button fullWidth variant="contained" color="primary" onClick={() => {
                advancePhase();
                advanceEvent();
            }}>
                手筋を表示
            </Button>
        ),
        solution: (
            <>                
                <Button fullWidth variant="contained" color="error"
                    onClick={() => {
                        markFailedCurrent()
                        setCurrentAnswer("wrong")
                        
                        //setResult(false)
                        advanceStep()
                    }}
                >
                    不正解
                </Button>
                <Button fullWidth variant="contained" color="success"
                    onClick={() => {
                        markSolvedCurrent()
                        setCurrentAnswer("correct")
                        
                        //setResult(true)
                        advanceStep()
                    }}>
                    正解
                </Button>
            </>
        ),        
    };

    ////
    return (
        <AppLayout
            header={`${currentIndex ?? 0 + 1}: ${title}`}
            footer={
                <Stack direction="row">
                    { phaseActions[currentPhase] }
                </Stack>
            }
        >
            <>
                
                <BoardPanel 
                    board={board}
                    hands={hands}
                    currentPhase={currentPhase}
                    advanceEvent={advanceEvent}
                    retreatEvent={retreatEvent}
                    advancePhase={advancePhase}
                    retreatPhase={retreatPhase}
                    advanceStep={advanceStep}
                    retreatStep={retreatStep}
                />

                <Box sx={{ minHeight: 0, display: "flex", flexDirection: "row" }}>
                    { /* 手順リスト */}
                    <Box
                        border={1}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            overflowY: "auto",
                            gap: 2, flex: 7,
                        }}>
                        {currentPhase === "solution" &&
                            <EventsView
                                events={events}
                                currentIndex={currentEventIndex}
                                onMoveClick={(i) => setCurrentEventIndex(i)} />
                        }
                    </Box>

                    { /* コントロール */}
                    <Stack border={1} sx={{ width: 150 }} gap={2} p={2}>
                        
                        { /*  {result !== null && (result ? "〇" : "×")} */ } 
                        <Box>
                            Problem: {`${formatAccuracy(accuracy)} [${solvedCount} | ${failedCount}]`}
                        </Box>
                        <Box>
                            Session: {`${queueResultSummary.correct} | ${queueResultSummary.wrong} / ${queueResultSummary.totalAnswered}`}
                            
                        </Box>
                        <Box>
                            length: { session && `${session.queue.length}`}
                        </Box>
                        {currentPhase === "solution" && <>
                            <button onClick={retreatEvent}>
                                ↑前の手
                            </button>                       
                        
                            <button onClick={advanceEvent}>
                                ↓次の手
                            </button>
                        
                        </>}

                        
                        
                    <button onClick={() =>
                        navigate("/summary", { state: { queue, queueResultMap} })
                    }>
                        セッション終了
                    </button>

                    </Stack>
                </Box>
            </>
        </AppLayout>
    )


}