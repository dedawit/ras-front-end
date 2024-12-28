import React from "react";

interface SpinnerProps {
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ color = "#ffffff" }) => {
  return (
    <div className="flex justify-center">
      <div
        className="animate-spin rounded-full h-6 w-6 border-b-2"
        style={{ borderColor: color }}
      ></div>
    </div>
  );
};
