import type { KifData } from './kifData'


export type KifEntry = {
  id: string;         // 一意の識別子  
  title: string;
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

