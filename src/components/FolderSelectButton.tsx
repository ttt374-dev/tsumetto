import React from "react"

export default function FolderSelectButton({ label = "Choose Folder", onSelected }: { label?: String, onSelected: (files: File[]) => void }) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files) onSelected(files);
  };

  return (
    <>
      <button onClick={handleClick}>{ label } </button>

      <input
        type="file"
        ref={fileRef}
         {...{ webkitdirectory: "" } as any}
              style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}
