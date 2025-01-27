import React from "react";

interface SpinnerProps {
  color?: string; // Can accept Tailwind classes or a hex color
  className?: string; // Additional Tailwind classes
}

export const Spinner: React.FC<SpinnerProps> = ({
  color = "border-white", // Default to a Tailwind class
  className = "",
}) => {
  const isTailwindColor = color.startsWith("border-");

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full h-6 w-6 border-b-2 ${
          isTailwindColor ? color : ""
        }`}
        style={!isTailwindColor ? { borderColor: color } : undefined}
      ></div>
    </div>
  );
};
