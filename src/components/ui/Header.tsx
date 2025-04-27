import { FC } from "react";
import SearchBar from "./SearchBar";
import CategorySelect from "./CategorySelect";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory?: string;
  setSelectedCategory?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

const Header: FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  placeholder,
}) => {
  return (
    <div className="bg-transparent p-4 w-full large-header">
      <div className="flex items-center space-x-4 w-full">
        {selectedCategory !== undefined && setSelectedCategory && (
          <CategorySelect
            value={selectedCategory}
            onChange={(category) => setSelectedCategory(category)}
          />
        )}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Header;
