import { Box } from "@mui/material";
import BoardView from '../components/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import { createKifData } from "../hooks/useKifPlayer";
import { type KifPlayerState, type KifLibraryEntry } from '../types';
import FileButton from "../components/FileButton";
import { useSwipeable } from "react-swipeable";
import { useNavigate } from "react-router-dom";

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
    importFile: (file: File) => Promise<KifLibraryEntry>;
    onSelect: (index: number) => void;
    //importFile: (file: File) => Promise<void>;
    // もし将来的にライブラリやimport機能を渡すならここに追加
    library: KifLibraryEntry[];
}
export default function PlayerScreen({ kifPlayerState, playFirst, playNext, playPrev, playLast, loadFromLibrary, importFile, onSelect, library }: PlayerScreenProps) {
    const navigate = useNavigate();    
    const kifData = useDisplayKifData(kifPlayerState)
    const curIndex = kifPlayerState.currentLibraryIndex
    const handleSelectFile = (file: File) => {
        importFile(file)
        onSelect(library.length)
    }
    const handleGoLibrary = () => {
        navigate("/library")
    }
        // スワイプハンドラ
    const handlers = useSwipeable({
        onSwipedLeft: () => {// 左スワイプ → 次の棋譜へ
            playNext()
        },
        onSwipedRight: () => {// 右スワイプ → 前の棋譜へ
            playPrev()
        },
        trackMouse: true, // PCでもマウスでスワイプ可能
        preventScrollOnSwipe: true,
    });
    return (
    <Box sx={{
          position: "sticky",
          top: 0,
          pt: "env(safe-area-inset-top)"}}>
            <h3>
                {curIndex !== undefined && `${curIndex + 1}: ${kifPlayerState.title}`}
            </h3>
            {/* 内部リストを選択 */}
            {library.length > 0 &&
                <SelectLibraryEntry currentIndex={kifPlayerState.currentLibraryIndex} library={library} onSelect={loadFromLibrary} />
            }
            <div>
                <div style={{ marginTop: 20 }}>
                    <Box {...handlers} sx={{
                        userSelect: "none", // 選択防止
                        touchAction: "pan-y", // 縦スクロールは阻害しない
                    }}>
                        <BoardView
                            board={kifData.board}
                            moves={kifData.moves}
                            hands={kifData.hands}
                        />
                    </Box>
                </div>
            </div>

            <div style={{ marginTop: 20 }}>
                <button onClick={playFirst} disabled={library.length == 0}>&lt;&lt;</button>
                <button onClick={playPrev} disabled={library.length == 0}>&lt;</button>
                <button onClick={playNext} disabled={library.length == 0}>&gt;</button>
                <button onClick={playLast} disabled={library.length == 0}>&gt;&gt;</button>
            </div>


            <button onClick={handleGoLibrary}>ライブラリ管理</button>
            {/* ファイル選択ボタン */}
            <FileButton label="棋譜ファイルを登録" onFileSelected={handleSelectFile} />
        </Box>
    );
}
