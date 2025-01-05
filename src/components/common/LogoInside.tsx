import React from "react";

export const LogoInside: React.FC = () => {
  return (
    <div className="  p-2  d-flex ">
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
