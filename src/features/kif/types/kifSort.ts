
export type SortState = {
  key: SortKey
  order: SortOrder
}

export type SortKey = 'createdAt' | 'title' | 'moveCount' | 'accuracy';
export type SortOrder = 'asc' | 'desc';

