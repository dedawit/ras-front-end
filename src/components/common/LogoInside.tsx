import React from "react";

export const LogoInside: React.FC = () => {
  return (
    <div className="  p-2  d-flex ">
      <img
        src="/icons/logo.svg"
        alt="Building Icon"
        className="sm:w-10 sm:h-10 w-5 h-5"
        height="auto"
        style={{ objectFit: "contain" }}
      />
      <span className="text-dark  font-bold ms-2 sm:text-lg  text-xs">
        TradeBrigeSolutions
      </span>
    </div>
  );
};
