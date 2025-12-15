import { useNavigate } from "react-router-dom";
import type { KifLibraryEntry } from "../types";

export interface LibraryScreenProps {
  library: KifLibraryEntry[];
  loadFromLibrary: (index: number) => void;
}

export default function LibraryScreen({ library, loadFromLibrary }: LibraryScreenProps) {
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
