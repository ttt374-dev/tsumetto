// components/MyAppBar.tsx
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function MyAppBar() {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          つめっと
        </Typography>

        <Button color="inherit" onClick={() => navigate("/library")}>
          Library
        </Button>
      </Toolbar>
    </AppBar>
  );
}
