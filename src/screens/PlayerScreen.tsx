import { useNavigate } from "react-router-dom";
import BoardView from '../components/BoardView'
import FileButton from "../components/FileButton";
import { createKifData, useKifPlayer } from "../hooks/useKifPlayer";
import { type KifPlayerState } from '../types';
import SelectLibraryEntry from '../components/SelectLibraryEntry';

export function useDisplayKifData(state: KifPlayerState) {
    return state.kifData ?? createKifData();
}

export default function KifPlayerScreen({
  kifPlayerState,
  playNext,
  playPrev,
}: any) {
    const { loadFromLibrary, library, importFile,  } = useKifPlayer();
    const navigate = useNavigate();

    const kifData = useDisplayKifData(kifPlayerState)
    const curIndex = kifPlayerState.currentLibraryIndex
    //console.log("current index", kifPlayerState.currentLibraryIndex)

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
                {curIndex !== undefined && `${curIndex + 1}: ${kifPlayerState.title}`}
            </div>
            <div style={{ marginTop: 20 }}>
                <button onClick={playPrev} disabled={library.length==0}>Prev Kif</button>
                <button onClick={playNext} disabled={library.length==0}>Next Kif</button>
            </div>


            {/* ファイル選択ボタン */}
            <FileButton label="Import File" onFileSelected={importFile} />
            <button onClick={() => navigate("/library")}>
                ライブラリ管理
            </button>

            {/* 内部リストを選択 */}
            <SelectLibraryEntry currentIndex={kifPlayerState.currentLibraryIndex} library={library} onSelect={loadFromLibrary} />
        </div>
    );
}
