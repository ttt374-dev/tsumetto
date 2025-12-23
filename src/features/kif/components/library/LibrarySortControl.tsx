import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { AppLayout } from "../../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../../hooks/useKif'
import MultipleFilesButton from '../../../../shared/components/MultipleFilesButton';
import type { KifEntry, SortState, SortKey, SortOrder } from "../../types";
import LibraryList from './LibraryList'

export default function LibrarySortControl({ sort, setSortKey, setSortOrder }: {
    sort: SortState,
    setSortKey: (order: SortKey) => void
    setSortOrder: (order: SortOrder) => void,
}) {
    const handleChangeKey = (e: any) => {
        setSortKey(e.target.value)
    }
    return (
        <Box>
            <select value={sort.key} onChange={handleChangeKey}>
                <option key="createdAt" value="createdAt">追加順</option>
                <option key="title" value="title">名前順</option>
                <option key="accuracy" value="accuracy">正答率</option>
            </select>

            <IconButton onClick={() => {
                console.log("toggle sort order")
                setSortOrder(sort.order == "asc" ? "desc" : "asc")
            }
            }>
                {sort.order === 'asc'
                    ? <ArrowUpwardIcon />
                    : <ArrowDownwardIcon />
                }
            </IconButton>
        </Box>
    )
}
