import './App.css'

import { StatusBar, Style } from "@capacitor/status-bar";
import PlayerScreen from "../features/kif/screens/PlayerScreen";
import { KifProvider } from '../features/kif/providers/KifProvider';

// ステータスバーをオーバーレイにしない
StatusBar.setOverlaysWebView({ overlay: false });
// ステータスバーの色を変更
StatusBar.setStyle({ style: Style.Dark });

export default function App() {
  /*
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const kifLibrary = useKifLibrary()
  const kifPlayer = useKifPlayer(kifLibrary.library, selectedIndex);
  */

  return (
    <KifProvider>
      <PlayerScreen />
    </KifProvider>
    /*
    <LayoutTestScreen/>
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
        <Route path="*" element={<Navigate to="/player" replace={false}/>} />
      </Routes>


    </BrowserRouter>
    */
  );
}
