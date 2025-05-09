import React from "react";

interface SubmitButtonProps {
  isLoading?: boolean;
  text?: string;
  loadingText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading = false,
  text = "Post RFQ",
  loadingText = "Posting RFQ...",
}) => {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={isLoading}
        className={`max-w-64 p-3 text-white rounded-lg shadow-md transition-all duration-300 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? loadingText : text}
      </button>
    </div>
  );
};

export default SubmitButton;
