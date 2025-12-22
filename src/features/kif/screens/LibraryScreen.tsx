import { List, ListItem, ListItemIcon, ListItemText, Checkbox, Typography } from "@mui/material";
import { AppLayout } from "../../../shared/components/AppLayout/AppLayout";
import { useKifEntityController } from "../hooks/useKifEntityController";


export default function LibraryScreen() {
    const { sortedEntries } = useKifEntityController()
    console.log("sorted entries on library", sortedEntries)

    return (
        <AppLayout
            header={"Library"}
        >
            <List>
                {sortedEntries.map((entry, i) => (
                    <ListItem>
                        <ListItemText>
                            { entry.kifData.title }
                        </ListItemText>
                    </ListItem>
                ))}


            </List>
        </AppLayout>
    )
}