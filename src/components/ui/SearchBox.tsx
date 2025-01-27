import { ChangeEvent } from "react";

interface SearchBoxProps {
  isVisible: boolean;
  onToggle: () => void;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  isVisible,
  onToggle,
  searchTerm,
  setSearchTerm,
}) => {
  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div
      className={`mobile-header fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-3/4 sm:w-1/2 bg-white transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-[120%]" // Increased translate value
      }`}
    >
      <div className="flex justify-center items-center h-12">
        {/* Search input */}
        <input
          type="text"
          value={searchTerm} // Controlled input
          onChange={handleInputChange} // Update searchTerm on input change
          placeholder="Search RFQ..."
          className="p-4 w-full border rounded-md focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBox;
