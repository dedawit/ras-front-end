import { FC } from "react";
import { RiSearchLine } from "react-icons/ri";

interface SearchBoxProps {
  isVisible: boolean;
  onToggle: () => void;
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
  placeholder?: string;
}

const SearchBox: FC<SearchBoxProps> = ({
  isVisible,
  onToggle,
  searchTerm,
  setSearchTerm,
  placeholder = "Search RFQ...",
}) => {
  return (
    <div
      className={`w-full transition-all duration-300 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <div className="relative w-full p-4">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-12 bg-select-background transparent-search-bg border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
        />
        <RiSearchLine className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
    </div>
  );
};

export default SearchBox;
