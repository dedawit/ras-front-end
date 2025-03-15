import { useState } from "react";
import MobileBuyerNav from "../common/MobileBuyerNav";
import MobileSellerNav from "../common/MobileSellerNav"; // Add this import
import { LogoInside } from "../common/LogoInside";
import SearchBox from "./../ui/SearchBox";
import { useUser } from "../../context/UserContext";

interface MobileHeaderProps {
  searchTerm?: string;
  setSearchTerm?: any;
  showSearchIcon?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchTerm = "",
  setSearchTerm,
  showSearchIcon = true,
}) => {
  const { lastRole } = useUser(); // Get lastRole from UserContext
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

  // Determine which nav to show based on lastRole
  const NavComponent = lastRole === "seller" ? MobileSellerNav : MobileBuyerNav;

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
              onClick={toggleSearch}
            />
          </div>
        )}
      </div>

      {/* Search Box */}
      <SearchBox
        isVisible={isSearchVisible}
        onToggle={toggleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Mobile Navigation (conditionally rendered based on lastRole) */}
      <div
        className={`fixed inset-0 z-50 bg-white shadow-lg transition-transform duration-300 mobile-header ${
          isNavVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavComponent onClose={toggleNav} />
      </div>

      {/* Overlay */}
      {isNavVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 mobile-header"
          onClick={toggleNav}
        ></div>
      )}
    </div>
  );
};

export default MobileHeader;
