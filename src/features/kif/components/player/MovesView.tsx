import { type Move } from "../../types";

interface Props {
    moves: Move[];
    currentIndex: number,
    onMoveClick: (index: number) => void;
    
    
}

export default function MovesView({ moves, currentIndex, onMoveClick  }: Props) {    
    
    return (
        <div>
            {                
                moves.map((m, i) => (
                    
                    <div 
                        key={i} 
                        onClick={() => onMoveClick(i) } 
                        style={{ padding: "2px 0",
                            backgroundColor: i === currentIndex ? "#ffd" : undefined, // ハイライト色
                            cursor: "pointer"
                        
                         }}>
                        {i + 1}: ({currentIndex}) { m.player === 'black' ? '▲' : '△'} {m.moveText} ({m.from?.file}, {m.from?.rank})
                    </div>
                ))
            }
        </div>
    )
}