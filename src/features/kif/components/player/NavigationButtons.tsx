import { Stack, IconButton } from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import type { SxProps, Theme } from "@mui/material/styles";
import { noFocusVisible } from "../../utils";

type NavigationButtonsProps = {
    navigateTo: (dest: string) => void
    

}

export default function NavigationButtons({ navigateTo }: NavigationButtonsProps) {
    return (
    <Stack direction="row" gap={2} sx={{justifyContent: "center"}}>
        { /* 
                    <Button sx={noFocusVisible} onClick={() => navigateTo("first")} disabled={sortedEntries.length == 0}>&lt;&lt;</Button>
                    <Button sx={noFocusVisible} onClick={() => navigateTo("prev")} disabled={sortedEntries.length == 0}>&lt;</Button>
                    <Button sx={noFocusVisible} onClick={() => navigateTo("next")} disabled={sortedEntries.length == 0}>&gt;</Button>
                    <Button sx={noFocusVisible} onClick={() => navigateTo("last")} disabled={sortedEntries.length == 0}>&gt;&gt;</Button>
*/ }
        <IconButton sx={{ ...noFocusVisible }} onClick={() => navigateTo("first")}>
            <FirstPageIcon />
        </IconButton>

        <IconButton sx={{ ...noFocusVisible }} onClick={() => navigateTo("prev")}>
            <ChevronLeftIcon />
        </IconButton>
        <IconButton sx={{ ...noFocusVisible }} onClick={() => navigateTo("next")}>
            <ChevronRightIcon />
        </IconButton>
        <IconButton sx={{ ...noFocusVisible }} onClick={() => navigateTo("last")}>
            <LastPageIcon />
        </IconButton>

    </Stack>)
}