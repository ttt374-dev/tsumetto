import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

export default function LibraryScreen({
  library,
  loadFromLibrary,
}: any) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] =
    useState<"title" | "createdAt">("createdAt");
  const [asc, setAsc] = useState(false);

  const sortedLibrary = useMemo(() => {
    const arr = [...library];
    arr.sort((a, b) => {
      const v1 = a[sortKey] ?? 0;
      const v2 = b[sortKey] ?? 0;
      return asc ? v1 - v2 : v2 - v1;
    });
    return arr;
  }, [library, sortKey, asc]);

  return (
    <div>
      <h2>Library</h2>

      {/* ソートUI */}
      <select
        value={sortKey}
        onChange={(e) =>
          setSortKey(e.target.value as any)
        }
      >
        <option value="createdAt">日時</option>
        <option value="title">名前</option>
      </select>

      <button onClick={() => setAsc((v) => !v)}>
        {asc ? "昇順" : "降順"}
      </button>

      <ul>
        {sortedLibrary.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => {
                const index = library.indexOf(entry);
                loadFromLibrary(index);
                navigate("/player");
              }}
            >
              {entry.title}
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <button onClick={() => navigate("/player")}>
        戻る
      </button>
    </div>
  );
}
