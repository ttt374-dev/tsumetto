import type { SxProps, Theme } from "@mui/material";

export const noFocusVisible: SxProps<Theme> = {  // TODO: utils
    '&:focus': {
        outline: 'none',
    },
};
