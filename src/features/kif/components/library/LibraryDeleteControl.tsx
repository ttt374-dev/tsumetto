import { Box, IconButton, Tooltip, Button } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


type Props = {
    checkedIds: Set<string>;
    selectAllCheckbox: () => void;
    clearAllCheckbox: () => void;
    onDeleteSelected: () => void;
}

export function LibraryDeleteControl({
    checkedIds, selectAllCheckbox, clearAllCheckbox, onDeleteSelected
 }: Props) {
    return (
        <>
            <Tooltip title="全選択">
                <IconButton
                    //onClick={() => setCheckedIds(new Set(library.map((e) => e.id)))}
                    onClick={selectAllCheckbox}
                    color="primary"
                >
                    <CheckBoxIcon />
                </IconButton>
            </Tooltip>

            {/* 全解除 */}
            <Tooltip title="全解除">
                <IconButton
                    //onClick={() => setCheckedIds(new Set())}
                    onClick={clearAllCheckbox}
                    color="primary"
                >
                    <CheckBoxOutlineBlankIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="選択した棋譜を削除">
                <IconButton onClick={onDeleteSelected} disabled={checkedIds.size === 0} color="error">
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    )
}