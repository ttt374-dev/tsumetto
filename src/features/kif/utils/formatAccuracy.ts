

// features/kif/utils/formatAccuracy.ts
export function formatAccuracy(
  accuracy: number | null,
  digits = 0
): string {
  if (accuracy == null) return "-"
  return `${(accuracy * 100).toFixed(digits)}%`
}
