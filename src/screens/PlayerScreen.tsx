import { useState } from 'react'
import { Box } from "@mui/material";
import BoardView from '../components/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import { createKifData } from "../hooks/useKifPlayer";
import { type KifPlayerState, type KifLibraryEntry } from '../types';
import FileButton from "../components/FileButton";
import { useSwipeable } from "react-swipeable";
//import { useNavigate } from "react-router-dom";
import MovesView from "../components/MovesView";
import { LibraryDialog } from '../components/LibraryDialog';
import { useKifPlayer } from "../hooks/useKifPlayer";
import { useKifLibrary } from '../hooks/useKifLibary';
import { useAndroidBackHandler } from '../hooks/useAndroidBackHandler';
import { AppLayout } from '../components/AppLayout';

export default function PlayerScreen() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const kifLibrary = useKifLibrary()
    const kifPlayer = useKifPlayer(kifLibrary.library, selectedIndex);
    const { playNext, playPrev, playFirst, playLast, loadFromLibrary } = kifPlayer    
    const { importFile, deleteEntry } = kifLibrary

    const library = kifLibrary.library
    const kifPlayerState = kifPlayer.kifPlayerState
    //const navigate = useNavigate();    
    const [libraryOpen, setLibraryOpen] = useState(false);
    const kifData = kifPlayerState.kifData
    const curIndex = kifPlayerState.currentLibraryIndex

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
    //useAndroidBackHandler(libraryOpen, () => setLibraryOpen(false))
    ////////////////////////
    //const items = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);  // debug

    return (
        <>
            <LibraryDialog
                open={libraryOpen}
                library={library}
                importFile={importFile}
                deleteEntry={deleteEntry}
                onSelect={(index) => { setSelectedIndex(index) }}
                onClose={() => { setLibraryOpen(false) }}
            />
            <AppLayout
                header={<>
                    <h2>
                        {curIndex !== undefined && `${curIndex + 1}: ${kifPlayerState.title}`}
                    </h2>
                </>}
                footer={<>
                    <div style={{ marginTop: 20 }}>
                        <button onClick={playFirst} disabled={library.length == 0}>&lt;&lt;</button>
                        <button onClick={playPrev} disabled={library.length == 0}>&lt;</button>
                        <button onClick={playNext} disabled={library.length == 0}>&gt;</button>
                        <button onClick={playLast} disabled={library.length == 0}>&gt;&gt;</button>
                    </div>
                    
                    <button onClick={() => setLibraryOpen(true)}>ライブラリ管理</button>

                </>}
            >
                <>
                                  {/* 内部リストを選択 */}
                    {library.length > 0 &&
                        <SelectLibraryEntry
                            currentIndex={kifPlayerState.currentLibraryIndex}
                            library={library} onSelect={loadFromLibrary} />
                    }
                    <Box {...handlers} sx={{
                        userSelect: "none", // 選択防止
                        touchAction: "pan-y", // 縦スクロールは阻害しない
                    }}>
                        <BoardView
                            board={kifData.board}
                            hands={kifData.hands}
                        />
                    </Box>

                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto"
                    }}>

                        {
                           <MovesView
                                moves={kifData.moves}
                                visible={kifPlayerState.showMoves}
                                onToggleVisible={kifPlayer.toggleShowMoves}
                            />

                        }
                    </Box>
                </>
            </AppLayout>
        </>
    )
    
}
