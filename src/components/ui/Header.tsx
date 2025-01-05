import { FC } from "react";
import { Button } from "./Button";
import SearchBar from "./SearchBar";
import CategorySelect from "./CategorySelect";

const Header: FC = () => {
  return (
    <div className="bg-transparent p-4 w-full large-header">
      <div className="flex items-center space-x-4 w-full">
        <CategorySelect />
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
