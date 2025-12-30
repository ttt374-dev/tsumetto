import React from "react"
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { IconButton } from "@mui/material";

type Props = {
  label?: String;
  onFileSelected: (files: File[]) => void
  useIconButton: boolean
}
export default function MultipleFilesButton({ 
  label = "Choose File", onFileSelected, useIconButton = false }
: Props) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files 
    if (files){
        onFileSelected(Array.from(files))
    }
    e.target.value = "";  // リセットしないと、再度同じファイルを開いても発火しない
    //const file = e.target.files?.[0];
    //if (file) onFileSelected(file);
  };

  return (
    <>
      { useIconButton ?
      <IconButton onClick={handleClick}>
        <UploadFileIcon/>
      </IconButton>
      :
        <button onClick={handleClick}>{ label } </button>
      }

      <input
        type="file"
        ref={fileRef}
        multiple={true}
        //accept="*/*"
        accept="*.kif"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}
