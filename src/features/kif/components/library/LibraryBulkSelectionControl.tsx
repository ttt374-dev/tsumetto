import { Box, IconButton, Tooltip, Button } from "@mui/material";
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import type { KifEntry, SortKey, SortOrder } from "../../types";

type Props = {
    entries: KifEntry[];
    checkedIds: Set<string>;
    selectAllCheckbox: () => void;
    clearAllCheckbox: () => void;
    //onDeleteSelected: () => void;

};


export function LibraryBulkSelectionControl({    
    checkedIds,
    selectAllCheckbox,
    clearAllCheckbox,
    
}: Props) {
    return (
        <Box sx={{ display: "flex", flexShrink: 0  } } alignItems="center">
            <>
                {/* 全選択 */}
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

            </>
        </Box>
    )
}
export default LibraryBulkSelectionControl