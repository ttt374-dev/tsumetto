// components/SelectLibraryEntry.tsx
import React from "react";
import { type KifLibraryEntry } from "../types/kifLibrary";

interface SelectLibraryEntryProps {
    //currentIndex: number | null;
    currentEntryId: string | null;
    library: KifLibraryEntry[];
    onSelect: (entryId: string) => void;
}
const SelectLibraryEntry: React.FC<SelectLibraryEntryProps> = ({ currentEntryId, library, onSelect }) => {
    const handleSelectLibrary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(e.target.value)
    }

    const value = currentEntryId ?? ""
    return (
        <select style={{ width: "300px",  display: "block",
    margin: "12px auto",}}
            value={value}
            onChange={handleSelectLibrary}>            {

                library.map((entry, i) => (
                    <option key={entry.id} value={entry.id}>{i+1}:  {entry.kifData.title}</option>
                ))
            }
        </select >
    )

}
export default SelectLibraryEntry;
