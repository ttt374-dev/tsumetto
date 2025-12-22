import { type Move } from "../types/";

interface Props {
    moves: Move[];
    
}

export default function MovesView({ moves  }: Props) {    
    return (
        <div>
            {
                
                moves.map((m, i) => (
                    <div key={i} style={{ padding: "2px 0" }}>
                        {i + 1}: { m.isBlack ? '▲' : '△'} {m.moveText} ({m.from})
                    </div>
                ))
            }
        </div>
    )
}