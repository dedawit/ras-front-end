import { FC, useState } from "react";
import MobileBuyerNav from "../common/MobileBuyerNav";
import MobileSellerNav from "../common/MobileSellerNav";
import { LogoInside } from "../common/LogoInside";
import SearchBox from "../ui/SearchBox";
import { useUser } from "../../context/UserContext";

interface MobileHeaderProps {
  searchTerm?: string;
  setSearchTerm?: React.Dispatch<React.SetStateAction<string>>;
  showSearchIcon?: boolean;
  placeholder?: string;
}

const MobileHeader: FC<MobileHeaderProps> = ({
  searchTerm = "",
  setSearchTerm,
  showSearchIcon = true,
  placeholder = "Search RFQ...",
}) => {
  const { lastRole } = useUser();
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleNav = () => {
    setIsNavVisible((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  const handleSearchTermChange = (newSearchTerm: string) => {
    if (setSearchTerm) {
      setSearchTerm(newSearchTerm);
    }
  };

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
        placeholder={placeholder}
      />

      {/* Mobile Navigation */}
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
