import React from "react";

const SubmitButton: React.FC = () => {
  return (
    <button
      type="submit"
      className="w-full p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 mt-6"
    >
      Post RFQ
    </button>
  );
};

export default SubmitButton;
