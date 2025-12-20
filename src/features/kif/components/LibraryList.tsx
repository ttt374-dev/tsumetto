import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";
import type { KifLibraryEntry, KifLibraryEntryWithLearning } from '../types/kifLibrary';
import { formatAccuracy } from "../utils";

function LibraryList({
    library,
    checkedIds,
    handleCheckboxChange,
    onSelect
}: {
    library: KifLibraryEntryWithLearning[];
    checkedIds: Set<string>;
    handleCheckboxChange: (id: string) => void;
    onSelect: (entry: KifLibraryEntry) => void;
}) {

    return (
        <List sx={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
            {library.map((entry, i) => (
                <ListItem key={entry.id} sx={{
                                  cursor: "pointer",
                            transition: "background-color 0.2s",
                            "&:hover": { backgroundColor: "#e0e0e0" },
                        border: 1}
                    } onClick={() => onSelect(entry)}>
                    <ListItemIcon  sx={{ minWidth: 16 }}  onClick={(e) => e.stopPropagation()} >
                        <Checkbox
                            size="small"
                            edge="start"
                            checked={checkedIds.has(entry.id)}
                            onChange={(e) => { e.stopPropagation(); handleCheckboxChange(entry.id); }}
                        
                        />
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
                        <Typography variant="body1" component="div" sx={{lineHeight:  1.3}}>
                            {i + 1}: {entry.kifData.title}
                        </Typography>
                        }
                        secondary={
                        <Typography variant="body2" component="div">
                            { `${new Date(entry.createdAt).toLocaleString("ja-JP")}, ${formatAccuracy(entry.accuracy)} ` }
                            
                        </Typography>
                        }
                        >


                        { /* {i + 1}: {entry.kifData.title}  ({new Date(entry.createdAt).toLocaleString("ja-JP")}) [{formatAccuracy(entry.accuracy)}] */ }
                    </ListItemText>
                    
              
                    
                </ListItem>
            ))}
        </List>
    );
}

export default LibraryList