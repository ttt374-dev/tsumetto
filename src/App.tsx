import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useKifPlayer } from "./hooks/useKifPlayer";
import KifPlayerScreen from "./screens/PlayerScreen";
import LibraryScreen from "./screens/LibraryScreen";

export default function App() {
  const kifPlayer = useKifPlayer();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/player"
          element={<KifPlayerScreen {...kifPlayer} />}
        />
        <Route
          path="/library"
          element={<LibraryScreen {...kifPlayer} />}
        />
        <Route path="*" element={<Navigate to="/player" />} />
      </Routes>
    </BrowserRouter>
  );
}
