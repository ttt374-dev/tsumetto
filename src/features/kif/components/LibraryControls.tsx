import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

import type { KifLibraryEntry } from "../types/kif";

type LibraryControlsProps = {
    library: KifLibraryEntry[];
    checkedIds: Set<string>;
    selectAll: () => void;
    clearAll: () => void;
    handleDeleteSelected: () => void;
};

export function LibraryControls({
    library,
    checkedIds,
    selectAll,
    clearAll,
    handleDeleteSelected
}: LibraryControlsProps) {
    return (
        <Box sx={{ display: "flex", flexShrink: 0 }}>
                {/* 全選択 */}
                <Tooltip title="全選択">
                    <IconButton
                        //onClick={() => setCheckedIds(new Set(library.map((e) => e.id)))}
                        onClick = {selectAll}
                        color="primary"
                    >
                        <CheckBoxIcon />
                    </IconButton>
                </Tooltip>

                {/* 全解除 */}
                <Tooltip title="全解除">
                    <IconButton
                        //onClick={() => setCheckedIds(new Set())}
                        onClick = {clearAll}
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
            </Box>
    )
}
export default LibraryControls