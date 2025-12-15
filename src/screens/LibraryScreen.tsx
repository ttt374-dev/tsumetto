import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, List, ListItem, ListItemIcon, ListItemText, Checkbox } from "@mui/material";
import type { KifLibraryEntry } from "../types";
import FileButton from "../components/FileButton";

export interface LibraryScreenProps {
  library: KifLibraryEntry[];
  importFile: (file: File) => Promise<KifLibraryEntry>;  
  onSelect: (index: number) => void;
  deleteEntry: (entry: KifLibraryEntry) => void;
}

export default function LibraryScreen({ library, importFile, onSelect, deleteEntry }: LibraryScreenProps) {
  const navigate = useNavigate();
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());

  
  const handleSelectFile = (file: File) => {
    importFile(file)
    onSelect(library.length)
  }
  const handleCheckboxChange = (id: string) => {
    setCheckedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    if (checkedIds.size === 0) return;

    const ok = window.confirm(
      `選択された ${checkedIds.size} 件を削除しますか？`
    );
    if (!ok) return;

    for (const id of checkedIds) {
      const entry = library.find((e) => e.id === id);
      if (entry) await deleteEntry(entry);
    }
    setCheckedIds(new Set());
  };


  ///////////////////////////
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box
       sx={{
          p: 2,
          backgroundColor: "#eeeeee",
          borderBottom: "1px solid #ccc",
          flexShrink: 0, // スクロールで縮まない
          position: "sticky",
          top: 0,
          pt: "env(safe-area-inset-top)",


        }}>
        {/* 全選択 / 全解除 */}
        <button
          onClick={() => setCheckedIds(new Set(library.map((e) => e.id)))}
        >
          全選択
        </button>
        <button onClick={() => setCheckedIds(new Set())}>全解除</button>
        <button onClick={() => navigate("/player")}>
          戻る
        </button>
      </Box>
      <Box
        sx={{
          flex: 1, // 残り領域を全て使う
          overflowY: "auto", // 縦スクロール
          px: 2,
          pt: 1,
        }}
      >
        <List>
          {library.map((entry, i) => (
            <ListItem key={entry.id}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checkedIds.has(entry.id)}
                  onChange={(e) => {
                    e.stopPropagation(); // ListItem のクリックイベントを防ぐ
                    handleCheckboxChange(entry.id);
                  }}
                />
              </ListItemIcon>
              <ListItemText
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.2s", // 背景色変化を滑らかに
                  "&:hover": {
                    backgroundColor: "#e0e0e0", // ホバー時の背景色
                  },
                }}
                onClick={() => {
                  const index = library.indexOf(entry);
                  //loadFromLibrary(index);
                  onSelect(index)
                  navigate("/player");
                }
                }>

                {i + 1}: {entry.title} ({new Date(entry.createdAt).toLocaleString("ja-JP")})
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <hr />

      <Box
        sx={{
          p: 2,
          backgroundColor: "#eeeeee",
          borderBottom: "1px solid #ccc",
          flexShrink: 0, // スクロールで縮まない
          position: "sticky",
          bottom: 0,
          pb: "env(safe-area-inset-bottom)",

        }}
      >
        <FileButton label="Import File" onFileSelected={handleSelectFile} />

        <button onClick={handleDeleteSelected}>Delete Selected</button>

         
      </Box>
    </Box>
  );
}
