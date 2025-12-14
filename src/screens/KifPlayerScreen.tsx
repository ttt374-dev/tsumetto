import BoardView from '../components/BoardView'
import FileButton from "../components/FileButton";
import { createKifData, useKifPlayer } from "../hooks/useKifPlayer";
import { type KifPlayerState } from '../types';

export function useDisplayKifData(state: KifPlayerState) {
    return state.kifData ?? createKifData();
}

export default function KifPlayerScreen() {
    const { kifPlayerState, loadFromFile, loadFromLibrary, library, importFile } = useKifPlayer();
    const handleLoadFile = async (file: File) => {
        loadFromFile(file)
    }

    const kifData = kifPlayerState.kifData ?? createKifData();


    return (
        <div style={{ padding: 20 }}>
            <h2>TSUME READER</h2>
            <div>

                <div style={{ marginTop: 20 }}>
                    <BoardView
                        board={kifData.board}
                        moves={kifData.moves}
                        hands={kifData.hands}
                    />
                </div>
            </div>

            <div>
                <FileButton onFileSelected={handleLoadFile} />
            </div>

 {/* ファイル選択ボタン */}
      <FileButton onFileSelected={importFile} />

            {/* 内部リストを選択 */}
            <select onChange={(e) => loadFromLibrary(e.target.value)}>
                {library.map((entry) => (
                    <option key={entry.id} value={entry.id}>{entry.title}</option>
                ))}
            </select>
        </div>
    );
}
