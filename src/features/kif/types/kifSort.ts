
export type SortState = {
  key: SortKey
  order: SortOrder
}

export type SortKey = 'createdAt' | 'title' | 'moveCount' | 'accuracy' | 'easeFactor' | 'nextReviewedAt';
export type SortOrder = 'asc' | 'desc';

