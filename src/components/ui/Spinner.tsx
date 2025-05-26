import React from "react";

interface SpinnerProps {
  color?: string;
  size?: string;
  thickness?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  color = "border-primary-color",
  thickness = "border-4",
  size = "h-6 w-6",
  className = "",
}) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-solid ${thickness} ${color} border-t-transparent ${size} ${className}`}
      />
    </div>
  );
};
