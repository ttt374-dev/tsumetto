import { Stack, IconButton } from "@mui/material"
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import type { SxProps, Theme } from "@mui/material/styles";
import { noFocusVisible } from "../../utils";

type NavigationButtonsProps = {
    navigateTo: (dest: string) => void
    isFirstEntry: (entryId: string) => boolean
    isLastEntity: (entryId: string) => boolean
    currentEntryId: string | null

}

export default function NavigationButtons({ navigateTo, isFirstEntry, isLastEntity, currentEntryId }: NavigationButtonsProps) {
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

        <IconButton sx={{ ...noFocusVisible }} disabled={isFirstEntry(currentEntryId ?? "")} onClick={() => navigateTo("prev")}>
            <ChevronLeftIcon />
        </IconButton>
        <IconButton sx={{ ...noFocusVisible }} disabled={isLastEntity(currentEntryId ?? "")} onClick={() => navigateTo("next")}>
            <ChevronRightIcon />
        </IconButton>
        <IconButton sx={{ ...noFocusVisible }} onClick={() => navigateTo("last")}>
            <LastPageIcon />
        </IconButton>

    </Stack>)
}