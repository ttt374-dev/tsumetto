import './App.css'

import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StatusBar, Style } from "@capacitor/status-bar";

import { useKifPlayer } from "./hooks/useKifPlayer";
import { useKifLibrary } from './hooks/useKifLibary';
import PlayerScreen from "./screens/PlayerScreen";
import LibraryScreen from "./screens/LibraryScreen";

// ステータスバーをオーバーレイにしない
StatusBar.setOverlaysWebView({ overlay: false });

// ステータスバーの色を変更
StatusBar.setStyle({ style: Style.Dark });


export default function App() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const kifLibrary = useKifLibrary()
  const kifPlayer = useKifPlayer(kifLibrary.library, selectedIndex);

  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/player"
          element={<PlayerScreen {...kifPlayer} library={kifLibrary.library} importFile={kifLibrary.importFile}
            onSelect={(index) => setSelectedIndex(index)           

            } />}
        />
        <Route
          path="/library"
          element={<LibraryScreen library={kifLibrary.library} importFile={kifLibrary.importFile}
            deleteEntry={kifLibrary.deleteEntry}
            onSelect={(index) => setSelectedIndex(index)} />}
        />
        <Route path="*" element={<Navigate to="/player" />} />
      </Routes>


    </BrowserRouter>
  );
}
