import { useState } from "react";
import type { DeckFilter } from "../../types";

export function useKifDeckFilter(){
    const [ filter, setFilter ] = useState<DeckFilter>({
        unansweredOnly: false,
        dueOnly: false,
    })

    
    return {
        filter, setFilter
    }
}