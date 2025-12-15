import { useNavigate } from "react-router-dom";
import type { KifLibraryEntry } from "../types";
import FileButton from "../components/FileButton";

export interface LibraryScreenProps {
  library: KifLibraryEntry[];
  loadFromLibrary: (index: number) => void;
  importFile: (file: File) => Promise<KifLibraryEntry>;
}

export default function LibraryScreen({ library, loadFromLibrary, importFile }: LibraryScreenProps) {
  const navigate = useNavigate();

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
              {entry.title} {new Date(entry.createdAt).toLocaleString("ja-JP")}
            </button>
          </li>
        ))}
      </ul>

      <hr />

      <FileButton label="Import File" onFileSelected={importFile} /> 
      <button onClick={() => navigate("/player")}>
        戻る
      </button>
    </div>
  );
}
