import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import type { KifLibraryEntry, SortKey, SortOrder } from "../types/kifLibrary";

type LibraryControlsProps = {
    library: KifLibraryEntry[];
    checkedIds: Set<string>;
    selectAll: () => void;
    clearAll: () => void;
    handleDeleteSelected: () => void;

    sortOrder: SortOrder,
    setSortKey: (key: SortKey) => void;
    toggleSortOrder: () => void;
};

export function LibraryControls({    
    checkedIds,
    selectAll,
    clearAll,
    handleDeleteSelected,

    sortOrder,
    setSortKey,
    toggleSortOrder
}: LibraryControlsProps) {
    return (
        <Box sx={{ display: "flex", flexShrink: 0 }}>
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

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setSortKey('createdAt')}>追加順</button>
                <button onClick={() => setSortKey('title')}>名前順</button>
                <button onClick={() => setSortKey('moveCount')}>手数順</button>
                <button onClick={() => setSortKey('accuracy')}>正答率</button>
                <button onClick={() => toggleSortOrder()}>
                    {sortOrder === 'asc' ? '昇順' : '降順'}
                </button>
            </div>          
        </Box>
    )
}
export default LibraryControls