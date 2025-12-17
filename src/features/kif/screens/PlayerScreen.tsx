import { Box } from "@mui/material";
import BoardView from '../components/BoardView'
import SelectLibraryEntry from '../components/SelectLibraryEntry';
import { useSwipeable } from "react-swipeable";
import { useNavigate, } from "react-router-dom";
import MovesView from "../components/MovesView";
import { AppLayout } from '../../../shared/components/AppLayout';
import { useKif } from '../hooks/useKif'

export default function PlayerScreen() {
    const { kifLibrary, kifPlayer } = useKif()
    //const kifLibrary = useKifLibrary()
    //const kifPlayer = useKifPlayer(kifLibrary.library);

    const { playNext, playPrev, playFirst, playLast, playByEntryId, playAtIndex } = kifPlayer
    const { importFile, deleteEntry, deleteEntries } = kifLibrary

    const library = kifLibrary.library
    const kifPlayerState = kifPlayer.kifPlayerState
    const navigate = useNavigate()
    //const navigate = useNavigate();    
    //const [libraryOpen, setLibraryOpen] = useState(false);
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
    const handleNavToLibrary = () => {
        navigate("/library")
    }
    return (
        <AppLayout
            header={<>
                <h2>
                    {curIndex !== undefined && `${curIndex + 1}: ${kifPlayerState.kifData.title}`}
                </h2>
            </>}
            footer={<>
                <div style={{ marginTop: 20 }}>
                    <button onClick={playFirst} disabled={library.length == 0}>&lt;&lt;</button>
                    <button onClick={playPrev} disabled={library.length == 0}>&lt;</button>
                    <button onClick={playNext} disabled={library.length == 0}>&gt;</button>
                    <button onClick={playLast} disabled={library.length == 0}>&gt;&gt;</button>
                </div>

                <button onClick={handleNavToLibrary}>ライブラリ管理</button>

            </>}
        >
            <>
                {/* 内部リストを選択 */}
                {library.length > 0 &&
                    <SelectLibraryEntry
                        currentIndex={kifPlayerState.currentLibraryIndex}
                        library={library} onSelect={playAtIndex} />

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
                    <MovesView
                        moves={kifData.moves}
                        visible={kifPlayerState.showMoves}
                        onToggleVisible={kifPlayer.toggleShowMoves}
                    />

                </Box>
            </>
        </AppLayout>
    )

}
