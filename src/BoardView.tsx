import React from "react";
import styles from "./BoardView.module.css";
import { type Board } from "./types";

interface Props {
  board: Board;
}

function BoardView({ board }: Props) {
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
    </div>
  );
}

export default BoardView;
