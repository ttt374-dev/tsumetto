import { useState, useEffect } from "react";
import styles from "./BoardView.module.css";
import { type Board, type Hand, type Move } from "../types";

interface Props {
  board: Board;
  hands: Hand;
  moves: Move[];
}

const fileLabels = ["９","８","７","６","５","４","３","２","１"];
const rankLabels = ["一","二","三","四","五","六","七","八","九"];

function BoardView({ board, hands, moves }: Props) {
  const [showMoves, setShowMoves] = useState(false);

  useEffect(() => {
    setShowMoves(false);
  }, [moves]);

  return (
    <div className={styles.container}>
      {/* 上の筋表示 */}
      <div className={styles.fileLabels}>

        <div className={styles.corner}></div> {/* 左上の空白 */}
        {fileLabels.map((f, i) => (
          <div key={i} className={styles.fileLabel}>{f}</div>
        ))}
      </div>

      {/* 盤面 + 左側の段表示 */}
      {board.map((row, r) => (
        <div key={r} className={styles.rowWithRank}>

          {/* 左側の段表示（スペース） */}
          <div className={styles.rankLabel}></div>
          {/* 盤面の行 */}
          {row
            .slice()
            .reverse() // file（9→1）だけ反転
            .map((cell, c) => {
              if (!cell) {
                return <div key={c} className={styles.emptyCell} />;
              }
              return (
                <div
                  key={c}
                  className={`${styles.cell} ${cell.isBlack ? "" : styles.white}`}
                >
                  {cell.name}
                </div>
              );
            })}

            {/* 右側の段表示 */}
          <div className={styles.rankLabel}>{rankLabels[r]}</div>

        </div>
      ))}

      {/* 持駒表示 */}
      <div style={{ marginTop: 12 }}>
        <div>先手の持ち駒：{hands.black || "なし"}</div>
      </div>

      {/* 解答表示 */}
      <button onClick={() => setShowMoves(!showMoves)} disabled={moves.length === 0}>
        {showMoves ? "解答を隠す" : "解答を表示"}
      </button>
      {showMoves &&
        moves.map((m, i) => (
          <div key={i} style={{ padding: "2px 0" }}>
            {m.rawText}
          </div>
        ))
      }
    </div>
  );
}

export default BoardView;
