import { FC, useState } from "react";
import { cn } from "../../lib/utils";
import { UserMode } from "../../types/user";

interface ModeProps {
  defaultMode?: UserMode;
}

const Mode: FC<ModeProps> = ({ defaultMode = "buyer" }) => {
  const [mode, setMode] = useState<UserMode>(defaultMode);
  const [showSwitchButton, setShowSwitchButton] = useState<boolean>(false);

  return (
    <div className="relative px-4 py-2 mb-4 flex flex-col items-start">
      {/* Display the current mode */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setShowSwitchButton((prev) => !prev)} // Toggle the button
      >
        <div className="relative w-10 h-10 flex items-center justify-center">
          {/* Outer Circle */}
          <div className="absolute w-12 h-12 rounded-full border-2 border-primary"></div>
          {/* Inner Broken Circle */}
          <div className="absolute w-8 h-8 rounded-full border-2 border-dashed border-primary"></div>
          {/* Mode Icon */}
          <span className="primary-color font-bold text-lg">
            {mode === "buyer" ? "B" : "S"}
          </span>
        </div>
        <span className="capitalize primary-color font-medium text-lg">
          {mode} Mode
        </span>
      </div>

      {/* Button to switch modes */}
      {showSwitchButton && (
        <button
          onClick={() => {
            setMode((prevMode) => (prevMode === "buyer" ? "seller" : "buyer"));
            setShowSwitchButton(false); // Hide button after switching
          }}
          className="mt-2 px-4 py-2 text-white primary-color-bg rounded-md shadow-md hover:opacity-90 transition"
        >
          Switch to {mode === "buyer" ? "Seller" : "Buyer"} Mode
        </button>
      )}
    </div>
  );
};

export default Mode;
