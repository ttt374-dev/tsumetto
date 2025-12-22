import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";

import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKif } from '../hooks/useKif'


export default function LibraryScreen() {
    const { kifEntryController } = useKif()
        const { 
            setCurrentEntryId,
            sortedEntries,
         } = kifEntryController
    //const { sortedEntries, setCurrentEntryId } = useKifEntryController()
    console.log("sorted entries on library", sortedEntries)
    const navigate = useNavigate()
    return (
        <AppLayout
            header={"Library"}
        >
            <List>
                {sortedEntries.map((entry, i) => (
                    <ListItem
                        key={entry.id}
                        onClick={() => {
                            setCurrentEntryId(entry.id)
                            navigate("/player")
                        }}
                    >
                        <ListItemText>
                            { entry.kifData.title } -
                            { entry.id.slice(0, 3) }
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </AppLayout>
    )
}