import React, { useState, useEffect } from "react";

interface FileUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  existingFile?: string | File | null; // Accept string (URL) or File
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

  useEffect(() => {
    if (existingFile) {
      if (typeof existingFile === "string") {
        // Extract file name from URL or path
        const extractedFileName =
          existingFile.split("/").pop()?.split("?")[0] || existingFile;
        setFileName(extractedFileName || null);
      } else if (existingFile instanceof File) {
        setFileName(existingFile.name);
      } else {
        setFileName(null);
      }
    } else {
      setFileName(null);
    }
  }, [existingFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the 10MB limit.");
        setFileName(null);
        onChange({
          target: { files: null },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(
          "Invalid file type. Only JPG, JPEG, PNG, PDF, DOCX, DOC, XLSX are allowed."
        );
        setFileName(null);
        onChange({
          target: { files: null },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      setFileName(file.name);
      setError(null);
      onChange(e); // Pass the event with the new File object
    } else {
      setFileName(null);
      setError(null);
      onChange(e); // Pass null event if no file selected
    }
  };

  const handleFileRemove = () => {
    setFileName(null);
    setError(null);
    const event = {
      target: { files: null },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event); // Notify parent of file removal
  };

  const inputId = `file-input-${fileName || "new"}`;

  return (
    <div className="flex flex-col items-start space-y-2 w-full max-w-full">
      <div className="w-full">
        {!fileName ? (
          <button
            type="button"
            onClick={() => document.getElementById(inputId)?.click()}
            className="flex-1 p-2 bg-primary-color text-white rounded-md hover:bg-blue-700 w-full"
          >
            Choose File
          </button>
        ) : (
          <div className="flex flex-col w-full">
            <span className="text-left w-full overflow-x-auto">
              {fileName.length > 20 ? `${fileName.slice(0, 35)}...` : fileName}
            </span>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2">
              <button
                type="button"
                onClick={() => document.getElementById(inputId)?.click()}
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
          </div>
        )}
        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FileUpload;
