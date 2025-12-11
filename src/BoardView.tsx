import { type Board } from "./types";

type Props = {
  board: Board;
};

function BoardView({ board }: Props) {
  return (
    <div
      style={{
        display: "inline-block",
        border: "1px solid #333",
        padding: 4,
      }}
    >
      {board.map((row, r) => (
        <div key={r} style={{ display: "flex" }}>
          {row.map((cell, c) => {
            if (!cell)
              return (
                <div
                  key={c}
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid #aaa",
                    background: "#f8f4e6",
                  }}
                />
              );

            return (
              <div
                key={c}
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #aaa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  background: "#f8f4e6",
                  transform: cell.isBlack ? "none" : "rotate(180deg)",
                }}
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

export default BoardView