import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useKifPlayer } from "./hooks/useKifPlayer";
import { useKifLibrary } from './hooks/useKifLibary';
import PlayerScreen from "./screens/PlayerScreen";
import LibraryScreen from "./screens/LibraryScreen";

export default function App() {
  const kifLibrary = useKifLibrary()
  const kifPlayer = useKifPlayer(kifLibrary.library);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/player"
          element={<PlayerScreen {...kifPlayer} library={kifLibrary.library} />}
        />
        <Route
          path="/library"
          element={<LibraryScreen library={kifLibrary.library} importFile={kifLibrary.importFile} loadFromLibrary={kifPlayer.loadFromLibrary} clearLibrary={kifLibrary.clearLibrary}/>}
        />
        <Route path="*" element={<Navigate to="/player" />} />
      </Routes>
    </BrowserRouter>
  );
}
