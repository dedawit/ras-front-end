import { FC } from "react";
import { RiSearchLine } from "react-icons/ri";

const SearchBar: FC = () => {
  return (
    <div className="relative flex-1 w-full hidden md:block">
      <input
        type="text"
        placeholder="Search RFQ..."
        className="w-full px-4 py-2 pr-12 bg-select-background  transparent-search-bg border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
      <RiSearchLine className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
    </div>
  );
};

export default SearchBar;
