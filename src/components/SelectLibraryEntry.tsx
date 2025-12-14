// components/SelectLibraryEntry.tsx
import React from "react";
import { type KifLibraryEntry, type KifPlayerState } from "../types";
import { createPlayState } from '../hooks/useKifPlayer'

interface Props {
  library: KifLibraryEntry[];
  kifPlayerState: KifPlayerState;
  setKifPlayerState: (state: KifPlayerState) => void;
}

const SelectLibraryEntry: React.FC<Props> = ({ library, kifPlayerState, setKifPlayerState }) => {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const index = library.findIndex((entry) => entry.id === id);
    if (index !== -1) {
      const entry = library[index];
      setKifPlayerState(createPlayState({
        kifData: entry.kifData,
        title: entry.title,
        currentLibraryIndex: index,
      }));
    }
  };

  return (
    <select
      value={kifPlayerState.currentLibraryIndex ?? ""}
      onChange={handleChange}
    >
      <option value="" disabled>選択してください</option>
      {library.map((entry) => (
        <option key={entry.id} value={entry.id}>{entry.title}</option>
      ))}
    </select>
  );
};

export default SelectLibraryEntry;
