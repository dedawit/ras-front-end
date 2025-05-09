import React from "react";
import { Dispatch, SetStateAction } from "react";

interface AwardButtonProps {
  isAwarding: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const AwardButton: React.FC<AwardButtonProps> = ({
  isAwarding,
  setShowModal,
}) => {
  return (
    <button
      onClick={() => setShowModal(true)}
      disabled={isAwarding}
      className={`
        relative p-3 px-6 text-white font-semibold text-lg
        bg-gradient-to-r from-green-500 to-emerald-600
        rounded-xl shadow-xl
        hover:from-green-600 hover:to-emerald-700
        transition-all duration-300 ease-in-out
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        group
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isAwarding ? (
          "Awarding..."
        ) : (
          <>
            <span className="group-hover:scale-110 transition-transform duration-200">
              🏆
            </span>
            Award Bid
          </>
        )}
      </span>
      {/* Subtle glow effect */}
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      {/* Animated shine effect */}
      <span className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700"></span>
    </button>
  );
};

export default AwardButton;
