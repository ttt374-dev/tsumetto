import { useRef } from 'react'
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import type { KifEntry, KifEntryWithLearning } from '../../types/kifEntry';
import { formatAccuracy } from "../../utils";
import { Check } from "@mui/icons-material";
import { useNavigate} from 'react-router-dom'

function LibraryList({
    sortedEntries,    
    setCurrentEntryId,
    isChecked,
    toggleChecked,
    
}: {
    sortedEntries: KifEntry[];
    setCurrentEntryId: (id: string) => void,
    isChecked: (id: string) => boolean,    
    toggleChecked: (id: string) => void;       
}) {
    
    /////////////////////////////////////////////////////
    const navigate = useNavigate()
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
                    onClick={() => {
                        setCurrentEntryId(entry.id)
                        navigate("/player")
                    }}
                >
                    <ListItemIcon onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                            size="small"
                            edge="start"

                            checked={isChecked(entry.id)}
                            onChange={(e) => {
                                e.stopPropagation();
                                toggleChecked(entry.id)
                            }}
                        />
                        <IconButton
                            size="small"

                        >
                            <EditIcon />
                        </IconButton>
                    </ListItemIcon>
                    <ListItemText>
                        {entry.kifData.title} -
                        {entry.id.slice(0, 3)}
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
}

export default LibraryList