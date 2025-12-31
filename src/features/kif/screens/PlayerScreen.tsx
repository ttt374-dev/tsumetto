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
import { CollectionsOutlined } from "@mui/icons-material";
import { formatDate } from "../../../shared/utils";
import { createKifEntry } from "../domain/factory";

export function useTimer(startSeconds: number = 0) {
  const [seconds, setSeconds] = useState(startSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => setSeconds(0);

  return { seconds, start, stop, reset, isRunning };
}

// utils
export function formatMMSS(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}


///////////////////////////////////////
export default function PlayerScreen() {
    //const [result, setResult] = useState<boolean | null>(false)    
    const navigate = useNavigate()

    //const { queue, entryMap, playerSession } = useKif()
    const { problemMap, playerSessionApi, learningRepository } = useKif()
    const { session, isLastIndex,
        advance: advanceStep, retreat: retreatStep, 
    } = playerSessionApi
    const queue: QueueItem[] = session?.queue ?? []
    const currentIndex = session?.currentIndex ?? 0

    //console.log("player session", session)
    //console.log("player session", playerSessionApi) 
    //console.log("sessionId on /player", session?.sessionId)
    const {
        currentProblem, currentEntryId,
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
            markSolvedCurrent, markFailedCurrent,
            nextReviewedAt, easeFactor, learningRecord,
        },
    } = useKifPlayer(session, problemMap, learningRepository)
    if (currentProblem === null) { navigate("/summary")}
    const { title, kifData: { events } } = currentProblem ?? createKifEntry()
    const moves = events.filter(e => e.type === "move")
    const timer = useTimer()

    useEffect(() => {
        if (!session || session.queue.length === 0) {
            //alert("no session / no such problem id")
            navigate("/summary", { state: { queue: []}});
        }
        timer.reset()
        timer.start()
    }, [session, navigate]);
      if (!session) {
          return null; // or loading
      }

    /*
    useEffect(() => {
  if (!session || session.queue.length === 0) {
    navigate("/deck");
  }
}, [session]);
*/
    useEffect(() => { timer.start() }, [])
    ////////////////////
    // フッターのアクションボタン

    function judgeAnswerQuality(answer: "correct" | "wrong", sec: number): number{
          if (answer === "wrong") return 0
        if (sec < 10) return 3
        return 0
    }

    const phaseActions: Record<PlayerPhase, JSX.Element> = {
        problem: (
            <Button fullWidth variant="contained" color="primary" onClick={() => {
                advancePhase();
                advanceMove();
                timer.stop()
            }}>
                手筋を表示
            </Button>
        ),
        solution: (
            <>                
                <Button fullWidth variant="contained" color="error"
                    onClick={() => {
                        const answerQulity = judgeAnswerQuality("wrong", timer.seconds)
                        markFailedCurrent(answerQulity)
                        //setCurrentAnswer("wrong")                        
                        //setResult(false)
                        
                        advanceStep()
                    }}
                >
                    不正解
                </Button>
                <Button fullWidth variant="contained" color="success"
                    onClick={() => {
                        const answerQulity = judgeAnswerQuality("correct", timer.seconds)
                        markSolvedCurrent(answerQulity)
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
            header={`${currentIndex + 1}: ${title} `}
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
                            {`${formatAccuracy(accuracy)} [${solvedCount} | ${failedCount}]`}
                        </Box>
                        { /* 
                        <Box>
                            { nextReviewedAt && formatDate(nextReviewedAt)}
                            / { easeFactor?.toFixed(2) }
                        </Box>    
                        */}
                        <Box onClick={() => {                             
                            timer.isRunning ? timer.stop() : timer.start()
                        }}>
                            timer: { formatMMSS(timer.seconds) }
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
                        <Box>
                            session: {session && `${currentIndex + 1} / ${session.queue.length}`}
                        </Box>

                    </Stack>
                </Box>
            </>
        </AppLayout>
    )


}