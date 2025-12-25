export const kanToNumber: Record<string, number> = {
  "一": 1,
  "二": 2,
  "三": 3,
  "四": 4,
  "五": 5,
  "六": 6,
  "七": 7,
  "八": 8,
  "九": 9,
};

export function zenkakuToNumber(ch: string): number {
  const code = ch.charCodeAt(0);
  if (code >= 0xFF10 && code <= 0xFF19) {
    return code - 0xFF10 + 0;
  }
  return parseInt(ch, 10);
}
