import React, { useState, useEffect } from "react";

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  existingFile?: string | null; // fileUrl (URL of existing file) passed from parent
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const FileUpload: React.FC<FileUploadProps> = ({ onChange, existingFile }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState<boolean>(false);

  // Set initial state based on existingFile prop
  useEffect(() => {
    if (existingFile) {
      const extractedFileName = existingFile.split("/").pop();
      setFileName(extractedFileName || null);
      setHasFile(true);
    } else {
      setHasFile(false);
    }
  }, [existingFile]);

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the 10MB limit.");
        setFileName(null);
        setHasFile(false);
        return;
      }

      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(
          "Invalid file type. Only JPG, JPEG, PNG, PDF, DOCX, DOC, XLSX are allowed."
        );
        setFileName(null);
        setHasFile(false);
        return;
      }

      setFileName(file.name);
      setError(null);
      setHasFile(true);
      onChange(e);
    }
  };

  // Handle file removal
  const handleFileRemove = () => {
    setFileName(null);
    setError(null);
    setHasFile(false);

    // Create empty file input event
    const event = {
      target: { files: null },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    onChange(event);
  };

  return (
    <div className="flex flex-col items-start space-y-2 w-full max-w-full">
      {error && <p className="text-red-500">{error}</p>}

      {/* Show only "Choose File" button when there's no file */}
      {!hasFile ? (
        <div className="w-full">
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
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-full">
          <span className="text-left w-full overflow-x-auto">
            {fileName && fileName.length > 20
              ? `${fileName.slice(0, 35)}...`
              : fileName}
          </span>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 w-full max-w-full">
            <button
              type="button"
              onClick={() => document.getElementById("file-input")?.click()}
              className="flex-1 sm:w-32 bg-primary-color text-white rounded-md hover:bg-blue-700 p-2"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleFileRemove}
              className="flex-1 sm:w-32 bg-red-500 text-white p-2 rounded-md"
            >
              Remove
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
