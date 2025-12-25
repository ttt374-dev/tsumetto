import styles from "./BoardView.module.css";
import type { PieceTypeKey, Board, Hands } from '../../../types/'
import { PieceTypes } from "../../../types/";

interface Props {
  board: Board;
  hands: Hands;
  
}

const fileLabels = ["９","８","７","６","５","４","３","２","１"];
const rankLabels = ["一","二","三","四","五","六","七","八","九"];

function displayPiece(type: PieceTypeKey): string {
  const piece = PieceTypes[type]

  if (!piece) {
    console.warn(`Unknown PieceTypeKey: ${type}`)
    return "？"
  }

  return piece.display
}
function BoardView({ board, hands}: Props) { 

  return (
    <div className={styles.container}>
      {/* 持駒表示 */}
      <div style={{ marginTop: 12 }}>
        { /* <div>△後手：{hands.white || "なし"}</div> */} 
      </div>


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
                  { /* {cell.key} */ }
                  { displayPiece(cell.key)}

                </div>
              );
            })}

            {/* 右側の段表示 */}
          <div className={styles.rankLabel}>{rankLabels[r]}</div>

        </div>
      ))}

      {/* 持駒表示 */}
      <div style={{ marginTop: 12 }}>
        <div>▲先手：{ /* hands.black || "なし" */}</div>
      </div>

      
    </div>
  );
}

export default BoardView;
