import { FC } from "react";
import "./../../styles/style.css";

interface ButtonProps {
  icon?: string;
  text: string;
  onClick?: () => void;
  width?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

const Button2: FC<ButtonProps> = ({
  icon,
  text,
  onClick,
  width = "w-auto",
  className = "",
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
