import { type KifPlayerState } from "../types";
import { createKifData } from "./useKifPlayer";

export function useDisplayKifData(state: KifPlayerState) {
    return state.kifData ?? createKifData();
}
