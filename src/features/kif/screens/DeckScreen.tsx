import { useState } from "react";
import { Stack, Box, InputLabel } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import { Navigate, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';
import type { KifEntry } from "../types";
import { useKifLibraryList } from '../hooks/library/useLibraryList';
import LibraryBulkSelectionControl from '../components/library/LibraryBulkSelectionControl';
import LibrarySortControl from '../components/library/LibrarySortControl';
import LibraryDeleteControl from '../components/library/LibraryDeleteControl';
import LibraryList from '../components/library/LibraryList';
import KifEntryEditDialog from '../dialogs/KifEntryEditDialog';
import KifBackupDialog from '../dialogs/KifBackupDialog';
import { useKifLibraryUI } from '../hooks/library/useKifLibraryUI';
import { FormControl, TextField, Select, MenuItem, Divider } from "@mui/material";
import type { SortState, SortKey, SortOrder } from '../types'
import { useKifLibrarySort } from "../hooks/library/useKifLibrarySort";
import { useKifSortedEntries } from "../hooks/library/useKifSortedEntries";



export default function DeckScreen() {
    const { kifLibrarySort} = useKif()
    const navigate = useNavigate()
    const { sort, setSortKey, setSortOrder } = kifLibrarySort
    
    const handleChangeKey = (e: any) => {
        console.log("set sort key", e.target.value)
        setSortKey(e.target.value)
    }

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
                </FormControl>

                <Stack direction="row" gap={2} justifyContent="center">
                    <button onClick={() => navigate("/player")}>
                        Start
                    </button>
                    <button onClick={() => navigate("/library")}>
                        Library
                    </button>
                </Stack>
            </>
        </AppLayout>
    )

}