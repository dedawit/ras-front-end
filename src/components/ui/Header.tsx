import { FC } from "react";
import { Button } from "./button";
import SearchBar from "./SearchBar";
import CategorySelect from "./CategoySelect";

const Header: FC = () => {
  return (
    <div className="bg-transparent border-b p-4">
      <div className="flex items-center space-x-4">
        <CategorySelect />
        <SearchBar />
        <Button variant="primary">Post RFQ</Button>
      </div>
    </div>
  );
};

export default Header;
