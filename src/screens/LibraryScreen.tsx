import { useNavigate } from "react-router-dom";
import type { KifLibraryEntry } from "../types";
import FileButton from "../components/FileButton";

export interface LibraryScreenProps {
  library: KifLibraryEntry[];
  loadFromLibrary: (index: number) => void;
  importFile: (file: File) => Promise<KifLibraryEntry>;
  clearLibrary: () => void;  
}

export default function LibraryScreen({ library, loadFromLibrary, importFile, clearLibrary }: LibraryScreenProps) {
  const navigate = useNavigate();

  const handleClear = async () => {
    const ok = window.confirm(
      "⚠️ ライブラリをすべて削除します。\n（デバッグ用）"
    );
    if (!ok) return;

    await clearLibrary();
  };

  return (
    <div>
      <h2>Library</h2>
      <ul>
        {library.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => {
                const index = library.indexOf(entry);
                loadFromLibrary(index);
                navigate("/player");
              }}
            >
              {entry.title} <span>: </span>{new Date(entry.createdAt).toLocaleString("ja-JP")}
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <FileButton label="Import File" onFileSelected={importFile} /> 

      <button onClick={handleClear}>
        Delete All
      </button>
      <button onClick={() => navigate("/player")}>
        戻る
      </button>
    </div>
  );
}
