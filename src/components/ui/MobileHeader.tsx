import { useState } from "react";
import MobileBuyerNav from "../common/MobileBuyerNav";
import { LogoInside } from "../common/LogoInside";

const MobileHeader: React.FC = () => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {
    setIsNavVisible((prev) => !prev);
  };

  return (
    <div>
      {/* Mobile Header */}
      <div className="flex items-center justify-between w-full p-4 bg-transparent mobile-header">
        {/* Hamburger Menu Icon */}
        <img
          src="icons/menu.svg"
          alt="Hamburger Menu"
          className="w-8 h-8 cursor-pointer"
          onClick={toggleNav}
        />

        {/* Logo */}
        <LogoInside />

        {/* Search Icon */}
        <img
          src="icons/search.svg"
          alt="Search"
          className="w-6 h-6 cursor-pointer"
          onClick={() => alert("Search clicked!")}
        />
      </div>

      {/* Mobile Buyer Navigation (conditionally rendered) */}
      {/* Mobile Buyer Navigation */}
      <div
        className={`fixed inset-0 z-50 bg-white shadow-lg transition-transform duration-300 ${
          isNavVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MobileBuyerNav onClose={toggleNav} />
      </div>
      {/* Overlay */}
      {isNavVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleNav}
        ></div>
      )}
    </div>
  );
};

export default MobileHeader;
