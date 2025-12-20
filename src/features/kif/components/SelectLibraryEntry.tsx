// components/SelectLibraryEntry.tsx
import React from "react";
import { type KifLibraryEntry } from "../types/kifLibrary";

interface SelectLibraryEntryProps {
    currentIndex: number | null;
    library: KifLibraryEntry[];
    onSelect: (index: number) => void;
}
const SelectLibraryEntry: React.FC<SelectLibraryEntryProps> = ({ currentIndex, library, onSelect }) => {
    const handleSelectLibrary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(Number(e.target.value))
    }

    const value = currentIndex ?? 0
    return (
        <select style={{ width: "300px",  display: "block",
    margin: "12px auto",}}
            value={value}
            onChange={handleSelectLibrary}>
            {

                library.map((entry, i) => (
                    <option key={entry.id} value={i}>{i+1}:  {entry.kifData.title}</option>
                ))
            }
        </select >
    )

}
export default SelectLibraryEntry;
