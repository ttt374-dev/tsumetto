import { type Move } from "../types";

interface Props {
    moves: Move[];
    visible: boolean;
    onToggleVisible: () => void;
}

export default function MovesView({ moves, visible, onToggleVisible }: Props) {    
    return (
        <div style={{ flex: 1, overflowY: "auto"}}>
            {/* 解答表示 */}
            < button onClick={onToggleVisible}
            disabled={moves.length === 0} >
                {visible ? "解答を隠す" : "解答を表示"}
            </button >
            {
                visible &&
                moves.map((m, i) => (
                    <div key={i} style={{ padding: "2px 0" }}>
                        {i + 1}: {m.moveText} ({m.from})
                    </div>
                ))
            }
        </div>
    )
}