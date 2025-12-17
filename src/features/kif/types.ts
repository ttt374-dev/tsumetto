export type Piece = {
  name: string;
  isBlack: boolean;
};

export type Board = (Piece | null)[][];

export type Hand = {
  black: string; // "金二 銀" のような文字列
  white: string;
};

export type Move = {
  moveNumber: number;
  moveText: string;
  isBlack: boolean;
  from: string | null;
}

export type KifData = {
  board: Board;
  hands: Hand;
  moves: Move[];

  title: string;
  source?: string;

  
}
export type KifLibraryEntry = {
  id: string;         // 一意の識別子
  //title: string;      // ファイル名や棋譜タイトル
  //source?: string;    // ファイルパスなど（必要なら）
  kifData: KifData;   // parse済みの棋譜データ
  createdAt: number;  
};

export type KifPlayerState = {
  kifData: KifData;
  //title: string,
  //mode: "temp" | "library";
  //playMode: "single" | "seq" | "random";
  //source?: string;

  showMoves: boolean;
  currentEntryId?: string;
  currentLibraryIndex?: number; // 追加
};


export type KifLibrary = KifLibraryEntry[];
