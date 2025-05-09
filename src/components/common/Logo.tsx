import React from "react";
import { Link } from "react-router-dom";

export const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="position-fixed top-0 start-0 p-2 bg-brand d-flex w-full text-decoration-none"
    >
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
    </Link>
  );
};
