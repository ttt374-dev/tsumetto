
export function formatDate(date: number): string {
    return new Date(date).toLocaleString("ja-JP")
}