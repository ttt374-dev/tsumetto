import { Box, IconButton, Tooltip, Button } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';


import type { KifLibraryEntry, SortKey, SortOrder } from "../types/kifLibrary";

type LibraryControlsProps = {
    library: KifLibraryEntry[];
    checkedIds: Set<string>;
    selectAll: () => void;
    clearAll: () => void;
    handleDeleteSelected: () => void;

    sortKey: SortKey,
    sortOrder: SortOrder,
    setSortKey: (key: SortKey) => void;
    toggleSortOrder: () => void;
    onBackup: () => void;
};


export function LibraryControls({    
    checkedIds,
    selectAll,
    clearAll,
    handleDeleteSelected,

    sortKey,    
    setSortKey,
    sortOrder,
    toggleSortOrder,
    onBackup
}: LibraryControlsProps) {
    const handleSortKeyChange = (e: any) => { 
        console.log(e.target.value)
        setSortKey(e.target.value) }

    return (
        <Box sx={{ display: "flex", flexShrink: 0  } } alignItems="center">
            {/* 全選択 */}
            <Tooltip title="全選択">
                <IconButton
                    //onClick={() => setCheckedIds(new Set(library.map((e) => e.id)))}
                    onClick={selectAll}
                    color="primary"
                >
                    <CheckBoxIcon />
                </IconButton>
            </Tooltip>

            {/* 全解除 */}
            <Tooltip title="全解除">
                <IconButton
                    //onClick={() => setCheckedIds(new Set())}
                    onClick={clearAll}
                    color="primary"
                >
                    <CheckBoxOutlineBlankIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="選択した棋譜を削除">
                <IconButton onClick={handleDeleteSelected} disabled={checkedIds.size === 0} color="error">
                    <DeleteIcon />
                </IconButton>
            </Tooltip>  
            
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => onBackup()}>
                    <ImportExportIcon />
                </IconButton>
            </Box>

            {/* ★ スペーサー */}
            <Box sx={{ flexGrow: 1 }} />
            
            <select value={sortKey} onChange={handleSortKeyChange}>
                <option key="createdAt" value="createdAt">追加順</option>
                <option key="title" value="title">名前順</option>
                <option key="accuracy" value="accuracy">正答率</option>
            </select>

            <IconButton onClick={toggleSortOrder}>
                {sortOrder === 'asc'
                    ? <ArrowUpwardIcon />
                    : <ArrowDownwardIcon />
                }
            </IconButton>

         

        </Box>
    )
}
export default LibraryControls