import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import type { KifLibraryEntry } from "../types";
import FileButton from "../components/FileButton";

export interface LibraryScreenProps {
  library: KifLibraryEntry[];  
  importFile: (file: File) => Promise<KifLibraryEntry>;
  clearLibrary: () => void;  
  onSelect: (index: number) => void;
}

export default function LibraryScreen({ library, importFile, clearLibrary, onSelect }: LibraryScreenProps) {
  const [importAndPlay, setImportAndPlay] = useState(false)
  const navigate = useNavigate();

  const handleClear = async () => {
    const ok = window.confirm(
      "⚠️ ライブラリをすべて削除します。\n（デバッグ用）"
    );
    if (!ok) return;

    await clearLibrary();
  };

  const handleSelectFile = (file: File) => {
    importFile(file)
    onSelect(library.length)
    if (importAndPlay) navigate("/player")
  }
  return (
    <div>
      <h2>Library</h2>
      <ul style={{ listStyle: "none"}}>
        {library.map((entry, i) => (
          <li style={{ margin: "4px"}} key={entry.id}>
            <button
              onClick={() => {
                const index = library.indexOf(entry);
                //loadFromLibrary(index);
                onSelect(index)
                navigate("/player");
              }}
            >
              {i+1}: {entry.title} ({new Date(entry.createdAt).toLocaleString("ja-JP")})
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <FileButton label="Import File" onFileSelected={handleSelectFile} /> 
      {/* チェックボックス */}
      <label style={{ display: "block", marginBottom: "12px" }}>
        <input
          type="checkbox"
          checked={importAndPlay}
          onChange={(e) => setImportAndPlay(e.target.checked)}
        />{" "}
        Import 後すぐ再生する
      </label>

      <button onClick={handleClear}>
        Delete All
      </button>
      <button onClick={() => navigate("/player")}>
        戻る
      </button>
    </div>
  );
}
