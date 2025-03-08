import { useState } from "react";
import MobileBuyerNav from "../common/MobileBuyerNav";
import { LogoInside } from "../common/LogoInside";
import SearchBox from "./../ui/SearchBox"; // Import SearchBox component

interface MobileHeaderProps {
  searchTerm?: string;
  setSearchTerm?: any;
  showSearchIcon?: boolean; // Optional prop to control visibility of search icon
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchTerm = "",
  setSearchTerm,

  showSearchIcon = true, // Default value for visibility
}) => {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Toggle the mobile navigation menu
  const toggleNav = () => {
    setIsNavVisible((prev) => !prev);
  };

  // Toggle the search box visibility
  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleSearchTermChange = (newSearchTerm: string) => {
    if (setSearchTerm) {
      setSearchTerm(newSearchTerm);
    }
  };

  return (
    <div>
      {/* Mobile Header */}
      <div className="flex items-center justify-between w-full p-4 bg-transparent mobile-header">
        {/* Hamburger Menu Icon */}
        <div className="flex-shrink-0">
          <img
            src="/icons/menu.svg"
            alt="Hamburger Menu"
            className="w-8 h-8 cursor-pointer"
            onClick={toggleNav}
          />
        </div>

        {/* Logo (centered using flex-grow) */}
        <div
          className={`flex-1 flex justify-center ${
            showSearchIcon ? "" : "pr-8"
          }`}
        >
          <LogoInside />
        </div>

        {/* Search Icon */}
        {showSearchIcon && (
          <div className="flex-shrink-0">
            <img
              src="icons/search.svg"
              alt="Search"
              className="w-6 h-6 cursor-pointer"
              onClick={toggleSearch} // Toggle search visibility
            />
          </div>
        )}
      </div>

      {/* Search Box */}
      <SearchBox
        isVisible={isSearchVisible}
        onToggle={toggleSearch} // Pass the toggleSearch function to close the search box
        searchTerm={searchTerm} // Pass searchTerm to SearchBox
        setSearchTerm={setSearchTerm} // Pass setSearchTerm to SearchBox
      />

      {/* Mobile Buyer Navigation (conditionally rendered) */}
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
