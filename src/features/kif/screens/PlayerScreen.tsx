import { useEffect, useState } from 'react'
import { Box, IconButton, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import BoardView from '../components/BoardView/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import MovesView from "../components/MovesView";
import { AppLayout } from '../../../shared/components/AppLayout/AppLayout';
import { useKif } from '../hooks/useKif'
import { createKifData, type KifLearningRecord } from '../types'
import { KifEntryEditDialog } from "../dialogs/KifEntryEditDialog";
import { formatAccuracy } from '../utils';
import type { KifEntry } from '../types/kifEntity';
import { createBoard, createPlayerState } from '../hooks/useKifPlayerOrig';
import { useKifEntityController } from '../hooks/useKifEntityController';
import type { Move } from '../types/'


export default function PlayerScreen() {
    //const { kifLibrary, kifPlayer, kifLearning, kifPlayerUI } = useKif()

    const { 
        currentEntry,
        setCurrentEntryId,
        sortedEntries,
     } = useKifEntityController()
    const kifData = currentEntry?.kifData ?? createKifData()
    //////////
    return (
        <AppLayout header={kifData.title}>
            <>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <SelectLibraryEntry
                        currentEntryId={currentEntry?.id ?? null}
                        entities={sortedEntries}
                        onSelect={(id) => {
                            setCurrentEntryId(id)
                        }}
                    />
                </Box>
                <BoardView
                    board={kifData.board}
                    hands={kifData.hands}
                />
                <MovesView moves={kifData.moves} />
            </>
        </AppLayout>
    )
}