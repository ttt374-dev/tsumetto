import './App.css'

import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useKifPlayer } from "./hooks/useKifPlayer";
import { useKifLibrary } from './hooks/useKifLibary';
import PlayerScreen from "./screens/PlayerScreen";
import LibraryScreen from "./screens/LibraryScreen";
import MyAppBar from "./components/MyAppBar";
import { Box } from "@mui/material";

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const kifLibrary = useKifLibrary()
  const kifPlayer = useKifPlayer(kifLibrary.library, selectedIndex);  

  return (
    <BrowserRouter>
      <MyAppBar />
      <Box component="main" sx={{ pt: "64px" }}>
        <Routes>
          <Route
            path="/player"
            element={<PlayerScreen {...kifPlayer} library={kifLibrary.library} />}
          />
          <Route
            path="/library"
            element={<LibraryScreen library={kifLibrary.library} importFile={kifLibrary.importFile}
              clearLibrary={kifLibrary.clearLibrary} onSelect={(index) => setSelectedIndex(index)} />}
          />
          <Route path="*" element={<Navigate to="/player" />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
