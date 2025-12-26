export function formatPercent(value: number | null, digits = 1): string {
  return value !== null ? `${(value * 100).toFixed(digits)}%` : "-"

}

