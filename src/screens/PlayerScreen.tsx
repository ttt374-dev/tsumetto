import { useNavigate } from "react-router-dom";
import BoardView from '../components/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import { createKifData } from "../hooks/useKifPlayer";
import { type KifPlayerState, type KifLibraryEntry } from '../types';

export function useDisplayKifData(state: KifPlayerState) {
    return state.kifData ?? createKifData();
}
export interface PlayerScreenProps {
    kifPlayerState: KifPlayerState;
    playNext: () => void;
    playPrev: () => void;
    loadFromLibrary: (index: number) => void;
    //importFile: (file: File) => Promise<void>;
    // もし将来的にライブラリやimport機能を渡すならここに追加
    library: KifLibraryEntry[];    

}
export default function PlayerScreen({kifPlayerState, playNext, playPrev, loadFromLibrary, library}: PlayerScreenProps) {
    const navigate = useNavigate();

    const kifData = useDisplayKifData(kifPlayerState)
    const curIndex = kifPlayerState.currentLibraryIndex
    
    return (
        <div>
            <h2>つめっと</h2>
            <h3>
                {curIndex !== undefined && `${curIndex + 1}: ${kifPlayerState.title}`}
            </h3>

            <div>
                <div style={{ marginTop: 20 }}>
                    <BoardView
                        board={kifData.board}
                        moves={kifData.moves}
                        hands={kifData.hands}
                    />
                </div>
            </div>
            
            <div style={{ marginTop: 20 }}>
                <button onClick={playPrev} disabled={library.length == 0}>前の棋譜</button>
                <button onClick={playNext} disabled={library.length == 0}>次の棋譜</button>
            </div>


            {/* ファイル選択ボタン */}
            { /* <FileButton label="Import File" onFileSelected={importFile} /> */}
            <button onClick={() => navigate("/library")}>
                ライブラリ管理
            </button>
            {library.length > 0 &&
                <SelectLibraryEntry currentIndex={kifPlayerState.currentLibraryIndex} library={library} onSelect={loadFromLibrary} />
            }
            {/* 内部リストを選択 */}

        </div>
    );
}
