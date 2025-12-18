import type { KifData } from './kif'

export type KifLibraryEntry = {
  id: string;         // 一意の識別子
  //title: string;      // ファイル名や棋譜タイトル
  //source?: string;    // ファイルパスなど（必要なら）
  kifData: KifData;   // parse済みの棋譜データ
  createdAt: number;  
};
export type SortKey = 'createdAt' | 'title' | 'moveCount';
export type SortOrder = 'asc' | 'desc';

export type KifLibraryState = {
  library: KifLibraryEntry[];
  sortKey: SortKey;
  sortOrder: SortOrder;
}

//export type KifLibrary = KifLibraryEntry[];
