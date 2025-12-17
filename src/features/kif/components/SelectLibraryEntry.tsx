// components/SelectLibraryEntry.tsx
import React from "react";
import { type KifLibraryEntry } from "../types/kif";

interface SelectLibraryEntryProps {
    currentIndex?: number;
    library: KifLibraryEntry[];
    onSelect: (index: number) => void;
}
const SelectLibraryEntry: React.FC<SelectLibraryEntryProps> = ({ currentIndex, library, onSelect }) => {
    const handleSelectLibrary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(Number(e.target.value))
    }

    return (
        <select style={{ width: "300px",  display: "block",
    margin: "12px auto",}}
            value={currentIndex}
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
