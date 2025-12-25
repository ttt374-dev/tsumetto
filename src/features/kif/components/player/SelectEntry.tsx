// components/SelectLibraryEntry.tsx
import React from "react";
import { type KifEntry } from "../../types/kifEntry";

interface Props {
    //currentIndex: number | null;
    currentEntryId: string | null;
    entities: KifEntry[];
    onSelect: (entryId: string) => void;
}
const SelectEntry: React.FC<Props> = ({ currentEntryId, entities, onSelect }) => {
    const handleSelectLibrary = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(e.target.value)
    }

    const value = currentEntryId ?? ""
    return (
        <select style={{ width: "300px",  display: "block",
    margin: "12px auto",}}
            value={value}
            onChange={handleSelectLibrary}>         
               {

                entities.map((entry, i) => (
                    <option key={entry.id} value={entry.id}>{i+1}:  {entry.title}</option>
                ))
            }
        </select >
    )

}
export default SelectEntry;
