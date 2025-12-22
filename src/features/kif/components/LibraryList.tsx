import { useRef } from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";
import type { KifEntry, KifEntryWithLearning } from '../types/kifEntry';
import { formatAccuracy } from "../utils";
import { Check } from "@mui/icons-material";

function LibraryList({
    library,
    checkedIds,
    onCheckboxChange,
    onSelect,
    editMode,
    toggleEditMode,
    clearAllCheckbox,
}: {
    library: KifEntryWithLearning[];
    checkedIds: Set<string>;
    onCheckboxChange: (id: string) => void;
    onSelect: (entry: KifEntry) => void;
    editMode: boolean;
    toggleEditMode: () => void;
    clearAllCheckbox: () => void;
}) {
    const LONG_PRESS_MS = 500;
    const timerRef = useRef<number | null>(null);
    const longPressedRef = useRef(false);

    const onPressStart = (entryId: string) => {
        longPressedRef.current = false;

        timerRef.current = window.setTimeout(() => {
            longPressedRef.current = true;
            if (editMode) {
                clearAllCheckbox();

            } else {
                onCheckboxChange(entryId)
            }
            toggleEditMode()
        }, LONG_PRESS_MS);
    };

    const onPressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    /////////////////////////////////////////////////////
    return (
        <List sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {library.map((entry, i) => (
                <ListItem key={entry.id} sx={{
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
                        onSelect(entry)
                    }
                    }>
                    <ListItemIcon sx={{ minWidth: 16 }} onClick={(e) => e.stopPropagation()} >
                        {editMode && (
                            <Checkbox
                                size="small"
                                edge="start"

                                checked={checkedIds.has(entry.id)}
                                onChange={(e) => { e.stopPropagation(); onCheckboxChange(entry.id); }}

                            />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        sx={{
                            //display: "flex",
                            //justifyContent: "space-between",
                            alignItems: "baseline",
                            gap: 1,
                            /*cursor: "pointer",
                            transition: "background-color 0.2s",
                            "&:hover": { backgroundColor: "#e0e0e0" }*/
                        }}

                        primary={
                            <Typography variant="body1" component="div" sx={{ lineHeight: 1.3 }}>
                                {i + 1}: {entry.kifData.title}
                            </Typography>
                        }
                        secondary={
                            <Typography variant="body2" component="div">
                                {`${new Date(entry.createdAt).toLocaleString("ja-JP")}, ${formatAccuracy(entry.accuracy)} `}

                            </Typography>
                        }
                    >
                    </ListItemText>

                </ListItem>
            ))}
        </List>
    );
}

export default LibraryList