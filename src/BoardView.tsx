import React from "react";
import styles from "./BoardView.module.css";
import { type Board, type Hand } from "./types";

interface Props {
  board: Board;
  hands: Hand;
}

function BoardView({ board , hands }: Props) {
  return (
    <div className={styles.container}>
      {board.map((row, r) => (
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
  <div>先手の持ち駒：{hands.black || "なし"}</div>
  
</div>


    </div>
  );
}

export default BoardView;
