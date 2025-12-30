import { useState, useMemo, useEffect } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import { Stack, Divider } from '@mui/material';

import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import MovesView from '../components/player/MovesView';
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
    const { session, isLastIndex,
        advance: advanceStep, retreat: retreatStep, 
    } = playerSessionApi
    const queue: QueueItem[] = session?.queue ?? []
    const currentIndex = session?.currentIndex ?? 0

    //console.log("player session", playerSessionApi) 
   
    const {
        currentProblem,
        replayApi: {
            board, hands,
            currentMoveIndex, setCurrentMoveIndex,
            retreatMove, advanceMove,
        },
        phaseApi: {
            currentPhase,
            advancePhase, retreatPhase
        },
        learnApi: {
            solvedCount, failedCount, accuracy,
            markSolvedCurrent, markFailedCurrent
        },
    } = useKifPlayer(session, problemMap)
    const { title, kifData: { events} } = currentProblem    
    const moves = events.filter(e => e.type === "move")
    
    ////////////////////
    // フッターのアクションボタン
    const phaseActions: Record<PlayerPhase, JSX.Element> = {
        problem: (
            <Button fullWidth variant="contained" color="primary" onClick={() => {
                advancePhase();
                advanceMove();
            }}>
                手筋を表示
            </Button>
        ),
        solution: (
            <>                
                <Button fullWidth variant="contained" color="error"
                    onClick={() => {
                        markFailedCurrent()
                        //setCurrentAnswer("wrong")
                        
                        //setResult(false)
                        advanceStep()
                    }}
                >
                    不正解
                </Button>
                <Button fullWidth variant="contained" color="success"
                    onClick={() => {
                        markSolvedCurrent()
                        //setCurrentAnswer("correct")
                        
                        //setResult(true)
                        //console.log("is last", isLastIndex, currentIndex, session?.queue.length)
                        if (isLastIndex){
                            navigate("/summary", { state: { queue} })
                        } else {
                            advanceStep()
                        }
                        
                    }}>
                    正解
                </Button>
            </>
        ),        
    };

    ////
    return (
        <AppLayout
            header={`${currentIndex + 1}: ${title}`}
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
                    advanceMove={advanceMove}
                    retreatMove={retreatMove}
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
                            <MovesView
                                moves={moves}
                                currentIndex={currentMoveIndex}
                                onMoveClick={(i) => setCurrentMoveIndex(i)} />
                        }
                    </Box>

                    { /* コントロール */}
                    <Stack border={1} sx={{ width: 150 }} gap={2} p={2}>
                        
                        { /*  {result !== null && (result ? "〇" : "×")} */ } 
                        <Box>
                            Problem: {`${formatAccuracy(accuracy)} [${solvedCount} | ${failedCount}]`}
                        </Box>
                        <Box>
                            { currentIndex }
                            
                        </Box>
                        <Box>
                            length: { session && `${session.queue.length}`}
                        </Box>
                        {currentPhase === "solution" && <>
                            <button onClick={retreatMove}>
                                ↑前の手
                            </button>
                            <button onClick={advanceMove}>
                                ↓次の手
                            </button>
                        
                        </>}                        
                        
                    <button onClick={() =>
                        navigate("/deck")
                    }>
                        デッキに戻る
                    </button>

                    </Stack>
                </Box>
            </>
        </AppLayout>
    )


}