import React from "react";

interface SpinnerProps {
  color?: string; // Tailwind class for border color (e.g., "border-blue-500")
  size?: string; // Tailwind class for size (e.g., "h-6 w-6" or "h-12 w-12")
  thickness?: string; // Tailwind class for border thickness (e.g., "border-4")
  className?: string; // Additional custom classes
}

export const Spinner: React.FC<SpinnerProps> = ({
  color = "border-primary-color", // Default to a neutral color
  thickness = "border-4", // Default thickness, controls ring weight
  className = "h-6 w-6",
}) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-solid  ${thickness} ${color} border-t-transparent ${className}`}
      ></div>
    </div>
  );
};
