import { Stack, Box  } from "@mui/material";
import BackupIcon from '@mui/icons-material/Backup';
import { Navigate, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";

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

export default function DeckScreen(){
    const navigate = useNavigate()

    return (
        <AppLayout
            header={ <Box>Deck</Box>}
        >
            <>
                <button onClick={() => navigate("/player")}>
                    Start
                </button>
            </>
        </AppLayout>
    )

}