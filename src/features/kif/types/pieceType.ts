export const PieceTypes = {
  // 歩
  "歩": {
    name: "歩",
    display: "歩",
    promoted: false,
  },
  "と": {
    name: "成歩",
    display: "と",
    promoted: true,
    base: "歩",
  },

  // 香
  "香": {
    name: "香",
    display: "香",
    promoted: false,
  },
  "成香": {
    name: "成香",
    display: "杏",
    promoted: true,
    base: "香",
  },

  // 桂
  "桂": {
    name: "桂",
    display: "桂",
    promoted: false,
  },
  "成桂": {
    name: "成桂",
    display: "圭",
    promoted: true,
    base: "桂",
  },

  // 銀
  "銀": {
    name: "銀",
    display: "銀",
    promoted: false,
  },
  "成銀": {
    name: "成銀",
    display: "全",
    promoted: true,
    base: "銀",
  },
  "銀成": {
    name: "銀成",
    display: "全",
    promoted: true,
    base: "銀",
  },
  // 金
  "金": {
    name: "金",
    display: "金",
    promoted: false,
  },

  // 角
  "角": {
    name: "角",
    display: "角",
    promoted: false,
  },
  "角成": {
    name: "角",
    display: "馬",
    promoted: true,
  },
  "馬": {
    name: "馬",
    display: "馬",
    promoted: true,
    base: "角",
  },

  // 飛
  "飛": {
    name: "飛",
    display: "飛",
    promoted: false,
  },
  "飛成": {
    name: "飛",
    display: "龍",
    promoted: true,
  },
  "龍": {
    name: "龍",
    display: "龍",
    promoted: true,
    base: "飛",
  },

  // 玉
  "玉": {
    name: "玉",
    display: "玉",
    promoted: false,
  },
} as const;

export type PieceTypeKey = keyof typeof PieceTypes;
