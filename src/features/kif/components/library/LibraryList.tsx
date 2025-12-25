import { useRef } from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import type { KifEntry, KifEntryWithLearning } from '../../types/kifEntry';
import { formatAccuracy } from "../../utils";
import { Check, OndemandVideoTwoTone } from "@mui/icons-material";
import { useNavigate} from 'react-router-dom'


function LibraryList({
    sortedEntries,    
    isChecked,
    toggleChecked,    
    onEntryClick,

    editMode,
    toggleEditMode,
    clearAllCheckbox,
}: {
    sortedEntries: KifEntry[];
    isChecked: (id: string) => boolean    
    toggleChecked: (id: string) => void;           
    onEntryClick: (entryId: string) => void
    editMode: boolean
    toggleEditMode: () => void;
    clearAllCheckbox: () => void;
}) {
    // 長押しで edit mode / view mode 切り替え
    const LONG_PRESS_MS = 500;
    const timerRef = useRef<number | null>(null);
    const longPressedRef = useRef(false);

    const onPressStart = (entryId: string) => {
        longPressedRef.current = false;

        timerRef.current = window.setTimeout(() => {
            longPressedRef.current = true;
            if (editMode){
                toggleChecked(entryId)
            } else {
                clearAllCheckbox()
            }
            toggleEditMode()
        }, LONG_PRESS_MS);
    }

    const onPressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    const navigate = useNavigate()
    /////////////////////////////////////////////////////
    
    return (
        <List>
            {sortedEntries.map((entry, i) => (
                <ListItem
                    key={entry.id}
                    sx={{
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        "&:hover": { backgroundColor: "#e0e0e0" },
                        border: 1
                    }}
                    onMouseDown={() => onPressStart(entry.id)}
                    onMouseUp={onPressEnd}
                    onMouseLeave={onPressEnd}
                    onTouchStart={() => onPressStart(entry.id)}
                    onTouchEnd={onPressEnd}
                    onClick={() => {
                        if (longPressedRef.current) return;
                         onEntryClick(entry.id)}
                    }
                >
                    <ListItemIcon sx={{ minWidth: 16 }} onClick={(e) => e.stopPropagation()}>
                        {editMode &&
                            <Checkbox
                                size="small"
                                edge="start"

                                checked={isChecked(entry.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggleChecked(entry.id)
                                }}
                            />
                        }
                        
                    </ListItemIcon>
                    <ListItemText>
                        {entry.title} -
                        {entry.id.slice(0, 3)}
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
}

export default LibraryList