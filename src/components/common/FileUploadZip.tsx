import React, { useState, useEffect, useRef } from "react";

interface FileUploadZipProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  existingFile?: string | File | null;
}

const FileUploadZip: React.FC<FileUploadZipProps> = ({
  onChange,
  existingFile,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingFile) {
      if (typeof existingFile === "string") {
        const extractedFileName = existingFile.split("/").pop()?.split("?")[0];
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
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.type !== "application/zip" && !file.name.endsWith(".zip")) {
        setError("Only ZIP files are allowed");
        setFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        onChange({
          target: { files: null },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      setFileName(file.name);
      setError(null);
      onChange(e);
    } else {
      setFileName(
        existingFile instanceof File
          ? existingFile.name
          : existingFile
          ? existingFile.split("/").pop()?.split("?")[0] || null
          : null
      );
      setError(null);
      onChange(e);
    }
  };

  const handleFileRemove = () => {
    setFileName(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onChange({
      target: { files: null },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const inputId = `zip-input-${fileName || "new"}`;

  return (
    <div className="flex flex-col items-start space-y-2 max-w-md">
      <div className="w-full">
        {!fileName ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-primary-color text-white rounded-md hover:bg-blue-700 w-48"
          >
            Choose ZIP File
          </button>
        ) : (
          <div className="flex flex-col space-y-2">
            <span className="text-left w-full overflow-x-auto max-w-md">
              {fileName.length > 20 ? `${fileName.slice(0, 35)}...` : fileName}
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-primary-color text-white rounded-md hover:bg-blue-700 w-32"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleFileRemove}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-32"
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
          accept=".zip,application/zip"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default FileUploadZip;
