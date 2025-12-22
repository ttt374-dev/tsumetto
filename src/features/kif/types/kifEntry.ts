import { createKifData, type KifData } from './kifData'
import { v4 as uuidv4 } from "uuid";

export type KifEntry = {
  id: string;         // 一意の識別子  
  kifData: KifData;   // parse済みの棋譜データ
  createdAt: number;  
};
//export type KifLibrary = KifLibraryEntry[];

// types/kifLibraryView.ts
export type KifEntryWithLearning = 
  KifEntry & {
  solvedCount: number
  failedCount: number
  accuracy: number | null   // 未学習は null
}

export function createEntity(){
  return {
    id: uuidv4(),
    kifData: createKifData(),
    createdAt: Date.now(),
  }
}