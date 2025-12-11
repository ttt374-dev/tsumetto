export type Piece = {
  name: string;
  isBlack: boolean;
};

export type Board = (Piece | null)[][];