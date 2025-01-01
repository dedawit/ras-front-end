import React from "react";

export const Logo: React.FC = () => {
  return (
    <div className="position-fixed top-0 start-0 p-2 bg-brand d-flex w-full">
      <img
        src="/icons/logo.svg"
        alt="Building Icon"
        width="50"
        height="auto"
        style={{ objectFit: "contain" }}
      />
      <span className="text-dark text-xl font-bold ms-2">
        TradeBrigeSolutions
      </span>
    </div>
  );
};
