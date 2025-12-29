import './App.css'

import { StatusBar, Style } from "@capacitor/status-bar";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PlayerScreen from '../features/kif/screens/PlayScreen';
import LibraryScreen from '../features/kif/screens/LibraryScreen';
import DeckScreen from '../features/kif/screens/DeckScreen';
import { KifProvider } from './providers/KifProvider';
import SummaryScreen from '../features/kif/screens/SummaryScreen';



// ステータスバーをオーバーレイにしない
//StatusBar.setOverlaysWebView({ overlay: false });
// ステータスバーの色を変更
//StatusBar.setStyle({ style: Style.Dark });

export default function App() {
  return (
    <KifProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/player" element={<PlayerScreen />}/>
          <Route path="/player/:entryId" element={<PlayerScreen />}/>
          <Route path="/library" element={<LibraryScreen />}/>    
          <Route path="/deck" element={<DeckScreen />}/>    
          <Route path="/summary" element={<SummaryScreen/>}/>
          <Route path="/" element={<Navigate to="/player"/>} />
        </Routes>
      </BrowserRouter>
    </KifProvider>
    
  );
}
