import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'
import MultipleFilesButton from '../../../shared/components/MultipleFilesButton';

export default function LibraryScreen() {
    const { kifEntryController, kifNavigation, kifLibrarySort } = useKif()
    const {
        entries,
        importFiles,
    } = kifEntryController

    const {
        setCurrentEntryId,
    } = kifNavigation
    const { sort, setSortOrder, setSortKey } = kifLibrarySort
    //const { sortedEntries, setCurrentEntryId } = useKifEntryController()
    //console.log("sorted entries on library", entries)
    const navigate = useNavigate()
    return (
        <AppLayout
            header={"Library"}
            footer={
                <MultipleFilesButton 
                    label="棋譜ファイルを登録" 
                    onFileSelected={
                        async (files: File[]) => {
                            importFiles(files)
                        }
                    }
                />
            }
        >
            <Box>
                <select value={sort.key} onChange={() => setSortKey}>
                <option key="createdAt" value="createdAt">追加順</option>
                <option key="title" value="title">名前順</option>
                <option key="accuracy" value="accuracy">正答率</option>
            </select>

            <IconButton onClick={() => setSortOrder(sort.order == "asc" ? "desc" : "asc")}>
                {sort.order === 'asc'
                    ? <ArrowUpwardIcon />
                    : <ArrowDownwardIcon />
                }
            </IconButton>
            </Box>
            { /*  エントリーリスト */ }
            <List>
                {entries.map((entry, i) => (
                    <ListItem
                        key={entry.id}
                        onClick={() => {
                            setCurrentEntryId(entry.id)
                            navigate("/player")
                        }}
                    >
                        <ListItemText>
                            { entry.kifData.title } -
                            { entry.id.slice(0, 3) }
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </AppLayout>
    )
}