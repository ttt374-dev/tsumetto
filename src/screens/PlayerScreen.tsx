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
    playFirst: () => void;
    playNext: () => void;
    playPrev: () => void;
    playLast: () => void;
    loadFromLibrary: (index: number) => void;
    //importFile: (file: File) => Promise<void>;
    // もし将来的にライブラリやimport機能を渡すならここに追加
    library: KifLibraryEntry[];    

}
export default function PlayerScreen({kifPlayerState, playFirst, playNext, playPrev, playLast, loadFromLibrary, library}: PlayerScreenProps) {
    const navigate = useNavigate();

    const kifData = useDisplayKifData(kifPlayerState)
    const curIndex = kifPlayerState.currentLibraryIndex
    
    return (
        <div>
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
                <button onClick={playFirst} disabled={library.length == 0}>最初の棋譜</button>
                <button onClick={playPrev} disabled={library.length == 0}>前の棋譜</button>
                <button onClick={playNext} disabled={library.length == 0}>次の棋譜</button>
                <button onClick={playLast} disabled={library.length == 0}>最後の棋譜</button>
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
