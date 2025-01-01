import { FC } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { Button } from "./button";
const categories = [
  "All Categories",
  "Electronics and Electrical Equipment",
  "Agriculture and Food Products",
  "Industrial Machinery",
  "Textiles and Apparel",
  "Construction Materials",
  "Chemicals and Plastics",
];

const CategorySelect: FC = () => {
  return (
    <div className="relative">
      <Button variant="outline" className="flex items-center space-x-2">
        <span>Categories</span>
        <RiArrowDownSLine className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default CategorySelect;
