import { useEffect, useRef } from "react";

import type { Move, Position, PlayerType, KifEvent } from "../../types";

interface Props {
    events: KifEvent[];
    currentIndex: number,
    onMoveClick: (index: number) => void;
}

export default function EventsView({ events, currentIndex, onMoveClick }: Props) {
const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = itemRefs.current[currentIndex];
    if (el) {
      el.scrollIntoView({
        block: "nearest",   // ← 上下どちらか近い方へ
        behavior: "smooth", // ← 再生中は外してもOK
      });
    }
  }, [currentIndex]);


    function formatFrom(from: Position | null) {
        return from ? `(${from.file}, ${from.rank})` : "(-, -)"

    }
    function formatPlayer(player: PlayerType): string {
        return player === 'black' ? '▲' : '△'
    }
    function formatMove(move: Move, index: number): string {
        return `${index}: ${formatPlayer(move.player)} ${move.moveText} ${formatFrom(move.from)}`
    }
    function formatEvent(event: KifEvent, index: number): string {
        switch (event.type) {
            case "start":
                return "=== 開始局面 ==="
                break
            case "move":
                return formatMove(event, index)
                break;
            default:
                return ""
        }

    }

    return (
        <div>
            {
                events.map((m, i) => (
                    <div
                        key={i}
                        ref={(el: HTMLDivElement | null) => {
                            itemRefs.current[i] = el;
                        }}
                        onClick={() => onMoveClick(i)}
                        style={{
                            padding: "2px 0",
                            backgroundColor: i === currentIndex ? "#ffd" : undefined, // ハイライト色
                            cursor: "pointer"

                        }}>
                        {formatEvent(m, i)}
                    </div>
                ))
            }
        </div>
    )
}