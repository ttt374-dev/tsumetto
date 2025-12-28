import { useState, useMemo, useEffect } from "react";
import { Box, IconButton, Button, Typography } from "@mui/material";
import { useNavigate, } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { Stack, Divider } from '@mui/material';
import ViewListIcon from "@mui/icons-material/ViewList";

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
    const { queue, entryMap } = useKif()
    const { 
        kifInfo: {
            events, title, entryId,
        },
        queueInfo: {
            currentIndex, advanceStep, setCurrentIndex,
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
    } = useKifPlayer(queue, entryMap)
    const navigate = useNavigate()

    
    ////////////////////
    return (
        <AppLayout
            header={`${currentIndex+1}: ${title}`}      
            footer={
                <Stack gap={2} direction="row" justifyContent="center">
                    <IconButton
                        onClick={() => navigate("/deck")}>
                        <ViewListIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => navigate("/library")}>
                        <LibraryBooksIcon />
                    </IconButton>
                </Stack>
            }      
        >
            <>
                <Box>entryid: { entryId }</Box>
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
                            }}
                            
                            
                        />

                        <MoveControl 
                            disabled={currentPhase === "problem"}
                            prevMove={movePrevEvent}
                            nextMove={moveNextEvent}
                        />

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
                            disabled={currentPhase === 'problem'}
                        />   

                        
                        <button onClick={advanceStep}>
                            次の問題へ
                        </button>

                    </Box>
                </Box>
            </>
        </AppLayout>
    )


}