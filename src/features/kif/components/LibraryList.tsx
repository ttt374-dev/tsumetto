import { List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import type { KifLibraryEntry } from '../types/kif';

function LibraryList({
    library,
    checkedIds,
    handleCheckboxChange,
    onSelect
}: {
    library: KifLibraryEntry[];
    checkedIds: Set<string>;
    handleCheckboxChange: (id: string) => void;
    onSelect: (entry: KifLibraryEntry) => void;
}) {
    return (
        <List sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {library.map((entry, i) => (
                <ListItem key={entry.id}>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={checkedIds.has(entry.id)}
                            onChange={(e) => { e.stopPropagation(); handleCheckboxChange(entry.id); }}
                        />
                    </ListItemIcon>
                    <ListItemText
                        sx={{
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                            "&:hover": { backgroundColor: "#e0e0e0" }
                        }}
                        onClick={() => onSelect(entry)}
                    >
                        {i + 1}: {entry.kifData.title} ({new Date(entry.createdAt).toLocaleString("ja-JP")})
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
}

export default LibraryList