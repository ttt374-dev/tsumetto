import { useState, useMemo } from "react";
import { Stack, Box, InputLabel, FormControlLabel } from "@mui/material";
import { createSession, Navigate, useNavigate } from 'react-router-dom';
import { IconButton } from "@mui/material";
import { v4 } from 'uuid'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { parseKif } from "../domain/parser";

import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'
import { FormControl, TextField, Checkbox, Select, MenuItem, Divider } from "@mui/material";
import { useKifLibrarySort } from "../hooks/library/useKifLibrarySort";
import { useKifDeckFilter } from "../hooks/deck/useKifDeckFilter";
import { createKifData, createKifEntryFromText } from "../domain/factory";
import MultipleFilesButton from "../../../shared/components/MultipleFilesButton";
import type { Deck, Problem, QueueItem} from "../types";
import { useProblemPersist } from "../hooks/problem/useProblemPersist";
import { useKifFilteredEntries } from "../hooks/deck/useKifFilteredEntries";
import { RecordVoiceOverSharp } from "@mui/icons-material";

const buildDeck = (): Deck => {
    return {
        id: v4(),
        name: "default",
        buildQueue: (problems: Problem[]): QueueItem[] => {
            return problems.map(p => ({
                problemId: p.id,
            }))
        }
    }
}


///////////////////
export default function DeckScreen() {
    const { problems, playerSessionApi, learningRepository} = useKif()
    const { records } = learningRepository
    
    const { filter, setFilter} = useKifDeckFilter()
   
    const navigate = useNavigate()
    const { sort, setSortKey, setSortOrder } = useKifLibrarySort()
    const filteredProblems = useKifFilteredEntries(problems, records, filter)
    const deck: Deck = useMemo(() => buildDeck(), [filteredProblems]);
    //const filteredProblems: Problem[] = []
    
    const handleSessionStart = () => {
        const queue = deck.buildQueue(filteredProblems)
        //console.log("built queue" ,queue)
        playerSessionApi.startSession(deck.id, queue)
        navigate("/player")
    }
    
    const handleChangeKey = (e: any) => {
        console.log("set sort key", e.target.value)
        setSortKey(e.target.value)
    }
    //nst { filter, setFilter } = kifDeckFilter//
    
    /////////////////////////
    return (
        <AppLayout
            header={<Box>Deck</Box>}
        >
            <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <Stack direction="row">
                        <TextField
                            select
                            fullWidth
                            label="Sort by"
                            value={sort.key}
                            onChange={handleChangeKey}
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="createdAt">登録日</MenuItem>
                            <MenuItem value="title">タイトル</MenuItem>
                            <MenuItem value="accuracy">正答率</MenuItem>
                        </TextField>
                        <IconButton onClick={() => {

                            setSortOrder(sort.order == "asc" ? "desc" : "asc")
                            console.log("toggle sort order", sort.order)
                        }
                        }>
                            {sort.order === 'asc'
                                ? <ArrowUpwardIcon />
                                : <ArrowDownwardIcon />
                            }
                        </IconButton>
                    </Stack>


                                <FormControlLabel control={
                    <Checkbox
                        checked={filter.unansweredOnly}
                        onChange={e =>
                            setFilter(f => ({
                                ...f,
                                unansweredOnly: e.target.checked
                            }))
                        }/>}
                        label="未回答のみ"/>
                        
                </FormControl>

                <Stack direction="row" gap={2} justifyContent="center">
                    <button onClick={handleSessionStart}>
                        セッション開始
                    </button>
                    <button onClick={() => navigate("/library")}>
                        Library
                    </button>
                    
                        
                        
                    
                </Stack>
            </>
        </AppLayout>
    )

}