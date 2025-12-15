// components/SelectLibraryEntry.tsx
import React from "react";
import { type KifLibraryEntry } from "../types";

interface SelectLibraryEntryProps {
        currentIndex?: number;
        library: KifLibraryEntry[];
        onSelect: (index: number) => void;
    }
    const SelectLibraryEntry: React.FC<SelectLibraryEntryProps> = ({currentIndex, library, onSelect}) => {
        const handleSelectLibrary = (e: React.ChangeEvent<HTMLSelectElement>) => {
            onSelect(Number(e.target.value))
        }

        return (
            <select
                value={currentIndex}
                onChange={handleSelectLibrary}>
                <option value="">Select Kif File</option>
                {

                    library.map((entry, i) => (
                        <option key={entry.id} value={i}>{entry.title}</option>
                    ))
                }
            </select >
        )

    }
export default SelectLibraryEntry;
