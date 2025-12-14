import { useState}  from "react";
import styles from "./BoardView.module.css";
import { type KifData } from "../types";

interface Props {
  kifData: KifData
}

function BoardView({ kifData }: Props) {
  const [showMoves, setShowMoves] = useState(false);

  return (
    <div className={styles.container}>
      {kifData.board.map((row, r) => (
        <div key={r} className={styles.row}>
          {row
            .slice()
            .reverse() // ← file（9→1）だけ反転
            .map((cell, c) => {
              if (!cell) {
                return <div key={c} className={styles.emptyCell} />;
              }

              return (
                <div
                  key={c}
                  className={`${styles.cell} ${
                    cell.isBlack ? "" : styles.white
                  }`}
                >
                  {cell.name}
                </div>
              );
            })}
        </div>
      ))}

      {/* 持駒表示 */}
      <div style={{ marginTop: 12 }}>
        <div>先手の持ち駒：{kifData.hands.black || "なし"}</div>
      </div>

      { /* 解答 */}

      <button onClick={() => setShowMoves(!showMoves)}>
        {showMoves ? "解答を隠す" : "解答を表示"}
      </button>
      {showMoves &&        
        kifData.moves.map((m, i) => (
          <div key={i} style={{ padding: "2px 0" }}>
            {m.rawText}
          </div>
        ))
      }
    </div>
  );
}

export default BoardView;
