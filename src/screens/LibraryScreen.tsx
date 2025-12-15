import React, { useMemo, useState } from "react";
import type { KifLibraryEntry } from "../types";

// 並び替えキー
export type SortKey = "title" | "createdAt";
export type SortOrder = "asc" | "desc";

interface LibraryScreenProps {
  library: KifLibraryEntry[];
  onSelect?: (index: number) => void; // 再生ページへ戻る用など
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({
  library,
  onSelect,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // 並び替え済み配列
  const sortedLibrary = useMemo(() => {
    const copied = [...library];

    copied.sort((a, b) => {
      let v1: string | number = 0;
      let v2: string | number = 0;

      switch (sortKey) {
        case "title":
          v1 = a.title ?? "";
          v2 = b.title ?? "";
          break;
        case "createdAt":
          v1 = a.createdAt ?? 0;
          v2 = b.createdAt ?? 0;
          break;
      }

      if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
      if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return copied;
  }, [library, sortKey, sortOrder]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Library</h2>

      {/* ソートコントロール */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <label>
          Sort by:
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{ marginLeft: 8 }}
          >
            <option value="createdAt">Imported date</option>
            <option value="title">Title</option>
          </select>
        </label>

        <label>
          Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            style={{ marginLeft: 8 }}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>
      </div>

      {/* 一覧 */}
      {sortedLibrary.length === 0 ? (
        <p>Library is empty</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sortedLibrary.map((entry, i) => (
            <li
              key={entry.id}
              style={{
                padding: "8px 4px",
                borderBottom: "1px solid #ddd",
                cursor: onSelect ? "pointer" : "default",
              }}
              onClick={() => onSelect?.(library.indexOf(entry))}
            >
              <div style={{ fontWeight: "bold" }}>{entry.title}</div>
              {entry.createdAt && (
                <div style={{ fontSize: 12, color: "#666" }}>
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default LibraryScreen