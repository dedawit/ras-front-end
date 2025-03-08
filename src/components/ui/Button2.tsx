import { FC } from "react";
import "./../../styles/style.css"; // Import your CSS file

interface ButtonProps {
  icon?: string; // Icon source
  text: string; // Button text
  onClick?: () => void; // Optional click handler
  width?: string; // Optional width for flexibility
  className?: string; // Optional custom className prop
  iconClassName?: string;
  textClassName?: string;
}

const Button2: FC<ButtonProps> = ({
  icon,
  text,
  onClick,
  width = "w-auto",
  className = "", // Default to an empty string
  iconClassName = "w-6 h-6",
  textClassName = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`gradient-button flex items-center justify-center space-x-2 px-4 py-2 rounded text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${width} ${className}`}
    >
      {icon && (
        <img
          src={icon}
          alt="icon"
          className={` ${iconClassName} `} // Icon size
        />
      )}
      <span className={`${textClassName}`}>{text}</span>
    </button>
  );
};

export default Button2;
