import React, { useState } from "react";

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFileName(file.name); // Set file name after upload
      onChange(e); // Pass the event to the parent component
    }
  };

  const handleFileRemove = () => {
    setFileName(null); // Clear file name on remove
  };

  return (
    <div className="flex flex-col items-start space-y-2 w-full">
      {!fileName ? (
        <>
          <button
            type="button"
            onClick={() => document.getElementById("file-input")?.click()}
            className="flex-1 p-2  bg-primary-color text-white rounded-md hover:bg-blue-700 w-full"
          >
            Choose File
          </button>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div className="flex flex-col w-full">
          <span className="text-left w-full">
            {fileName.length > 20 ? `${fileName.slice(0, 35)}...` : fileName}
          </span>
          <div className="flex space-x-2 mt-2 w-full">
            <button
              type="button"
              onClick={() => document.getElementById("file-input")?.click()}
              className="p-2  bg-primary-color text-white rounded-md hover:bg-blue-700 w-1/2"
            >
              Change File
            </button>
            <button
              type="button"
              onClick={handleFileRemove}
              className="p-2  bg-red-500 text-white rounded-md hover:bg-red-600 w-1/2"
            >
              Remove File
            </button>
          </div>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
