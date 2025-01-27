import React, { useState } from "react";

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
];

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the 10MB limit.");
        setFileName(null); // Clear file name on error
        return;
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(
          "Invalid file type. Only JPG, JPEG, PNG, PDF, DOCX, DOC, XLSX are allowed."
        );
        setFileName(null); // Clear file name on error
        return;
      }

      setFileName(file.name); // Set file name after upload
      setError(null); // Clear any previous error
      onChange(e); // Pass the event to the parent component
    }
  };

  const handleFileRemove = () => {
    setFileName(null); // Clear file name on remove
    setError(null); // Clear any previous error
  };

  return (
    <div className="flex flex-col items-start space-y-2 w-full max-w-full">
      {error && <p className="text-red-500">{error}</p>}
      {!fileName ? (
        <>
          <button
            type="button"
            onClick={() => document.getElementById("file-input")?.click()}
            className="flex-1 p-2 bg-primary-color text-white rounded-md hover:bg-blue-700 w-full"
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
        <div className="flex flex-col w-full max-w-full">
          <span className="text-left w-full overflow-x-auto">
            {fileName.length > 20 ? `${fileName.slice(0, 35)}...` : fileName}
          </span>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 w-full max-w-full">
            <button
              type="button"
              onClick={() => document.getElementById("file-input")?.click()}
              className="p-2 bg-primary-color text-white rounded-md hover:bg-blue-700 w-full sm:w-1/2"
            >
              Change File
            </button>
            <button
              type="button"
              onClick={handleFileRemove}
              className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full sm:w-1/2"
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
