import { AppLayout } from '../components/AppLayout';
import { Box, List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";

export default function LayoutTestScreen() {
    const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
    return (
        <AppLayout
            header={<>Header</>}
            footer={<>Footer</>}
        >
            <>
                <Box>
                    Board
                </Box>
                <Box sx={{                   
                    
                    flexDirection: "column",
                    overflowY: "auto"
                }}>

                {
                    
                    items.map((num) => (
                        <div>hoasdfhoasdf</div>

                    ))
                }
                </Box>
            </>
        </AppLayout>
    )
}