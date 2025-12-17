import React from "react"

export default function MultipleFilesButton({ label = "Choose File", onFileSelected }: { label?: String, onFileSelected: (files: File[]) => void }) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files 
    if (files){
        onFileSelected(Array.from(files))
    }

    //const file = e.target.files?.[0];
    //if (file) onFileSelected(file);
  };

  return (
    <>
      <button onClick={handleClick}>{ label } </button>

      <input
        type="file"
        ref={fileRef}
        multiple={true}
        accept="*/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </>
  );
}
