import { Box, IconButton } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close'
import type { KifLearningRecord } from "../../types";


export default function MarkLearning({ record, currentEntryId, markSolved, markFailed,}: 
    { 
        record: KifLearningRecord,
        currentEntryId: string,
        markSolved: (id: string) => void,
        markFailed: (id: string) => void,
    }) {
    return (
        <>
            <Box>
                <IconButton
                    disabled={!currentEntryId}
                    onClick={() => currentEntryId && markSolved(currentEntryId)}>
                    <CheckCircleIcon />
                </IconButton>
                <IconButton
                    disabled={!currentEntryId}
                    onClick={() => currentEntryId && markFailed(currentEntryId)}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box>
                {record.solvedCount} | {record.failedCount}
            </Box >
        </>
    )
}