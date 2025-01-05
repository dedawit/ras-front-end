import { FC, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { Button } from "./Button";

const categories = [
  "All Categories",
  "Electronics and Electrical Equipment",
  "Industrial Machinery and Equipment",
  "Construction and Building Materials",
  "Automotive and Transportation",
  "Medical Equipment and Supplies",
  "Agriculture and Food Products",
  "Chemicals and Pharmaceuticals",
  "Textiles and Apparel",
  "Office Supplies and Furniture",
  "Energy and Power Generation",
];

interface CategorySelectProps {
  width?: string; // Optional prop to customize width
}

const CategorySelect: FC<CategorySelectProps> = ({ width = "w-96" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false); // Close dropdown after selecting a category
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle the dropdown open/close
  };

  return (
    <div className={`relative ${width}`}>
      <Button
        variant="outline"
        className="flex items-center space-x-2 w-full border-select-color text-select-color text-left overflow-hidden text-ellipsis whitespace-nowrap"
        onClick={toggleDropdown} // Toggle dropdown when clicking button
      >
        <span className="flex-grow">{selectedCategory}</span>
        <RiArrowDownSLine className="w-5 h-5 text-select-color ml-2" />
      </Button>
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded shadow-lg">
          {categories
            .filter((category) => category !== selectedCategory) // Hide selected category
            .map((category) => (
              <button
                key={category}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategorySelect;
