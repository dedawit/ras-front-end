import { FC } from "react";
import { Button } from "./Button";
import SearchBar from "./SearchBar";
import CategorySelect from "./CategorySelect";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

const Header: FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <div className="bg-transparent p-4 w-full large-header">
      <div className="flex items-center space-x-4 w-full">
        <CategorySelect
          value={selectedCategory} // Controlled if you pass `value` and `onChange`
          onChange={(category) => setSelectedCategory(category)} // Controlled mode
        />
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
    </div>
  );
};

export default Header;
