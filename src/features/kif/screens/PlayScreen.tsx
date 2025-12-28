import { useState, useMemo, useEffect } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Stack, Divider } from '@mui/material';

import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import EventsView from '../components/player/EventsView';
import MoveControl from '../components/player/MoveControl';
import SolutionControl from '../components/player/SolutionControl';
import BoardView from "../components/player/BoardView";
import SolveControl from "../components/player/SolveControl";
import { formatAccuracy } from "../utils";
import { useKifPlayer } from "../hooks/player/useKifPlayer";

///////////////////////////////////////
export default function PlayerScreen(){
    const { sortedEntries, queue, entryMap } = useKif()
    const { 
        kifInfo: {
            events, title
        },
        queueInfo: {
            currentIndex, advanceStep
        },
        replayInfo: {
            board, hands, 
            currentEventIndex, setCurrentEventIndex,
            moveNextEvent, movePrevEvent,
        },
        phaseInfo: {
            currentPhase, setCurrentPhase,
            advancePhase, retreatPhase
        },
        learnInfo: {
            solvedCount, failedCount,
            markSolvedCurrent, markFailedCurrent
        }
    } = useKifPlayer(sortedEntries)
    const navigate = useNavigate()

    ////////////////////
    return (
        <AppLayout
            header={`${currentIndex+1}: ${title}`}      
            footer={
                <Stack gap={2} direction="row" justifyContent="center">
                    <IconButton
                        onClick={() => navigate("/library")}>
                        <LibraryBooksIcon />
                    </IconButton>
                </Stack>
            }      
        >
            <>
                <Stack justifyContent="center">
                    <Box>
                        <BoardView
                            board={board}
                            hands={hands}>
                        </BoardView>
                    </Box>
                </Stack>
                { /* 左：手順リスト、右：操作コントロール */}
                <Box sx={{ minHeight: 0, display: "flex", flexDirection: "row" }}>
                    <Box
                        border={1}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            overflowY: "auto",
                            gap: 2, flex: 7,
                        }}>
                            { currentPhase !== "problem" &&
                        <EventsView
                            events={events}
                            currentIndex={currentEventIndex}
                            onMoveClick={(i) => setCurrentEventIndex(i)} />                        
}
                    </Box>

                    { /* コントロール */}
                    <Box border={1} sx={{ width: 200 }}>
                        <Box>
                            Phase: { currentPhase}
                        </Box>
                        <SolutionControl
                            currentPhase={currentPhase}
                            onShowAnswer={() => {
                                //setPhase("solution")                                
                                advancePhase()
                                moveNextEvent()
                            }}
                            onHideAnswer={() => {
                                retreatPhase()
                                setCurrentEventIndex(0)
                            }
                            }
                        />
                        {currentPhase !== "problem" &&
                            <MoveControl
                                prevMove={movePrevEvent}
                                nextMove={moveNextEvent}
                            />
                        }
                        <Box>
                            { `${formatAccuracy(solvedCount/(solvedCount+failedCount))}` }
                        </Box>
                        <Box>
                            { `${solvedCount} | ${failedCount}`}
                        </Box>
                        <SolveControl
                            onSolved={() => {
                                markSolvedCurrent()
                                advancePhase()
                            }}
                            onFailed={()=>{
                                markFailedCurrent()
                                advancePhase()
                            }}                            
                            
                        />   

                        { currentPhase === "result" &&
                            <button onClick={advanceStep}>
                                次の問題へ
                            </button>
                        }
                    </Box>
                </Box>
            </>
        </AppLayout>
    )


}