import React from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import CategorySelect from "../ui/CategorySelect";
import { FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface NavbarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  onLoginClick,
}) => {
  return (
    <header className=" shadow-md">
      {/* Top Bar with Logo */}
      <div className="flex items-center justify-between p-4 bg-brand">
        <div className="flex items-center">
          <img
            src="/icons/logo.svg"
            alt="Building Icon"
            width="50"
            height="auto"
            style={{ objectFit: "contain" }}
          />
          <span className="text-dark text-2xl font-bold ms-2">
            TradeBrigeSolutions
          </span>
        </div>
        <motion.button
          onClick={onLoginClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className=" px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 transition duration-300 hover:bg-blue-700 shadow-md"
        >
          <FaSignInAlt className="text-lg" />
          <span className="font-semibold">Login</span>
        </motion.button>
      </div>

      {/* Search and Category Bar */}
      <div className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-white">
        <CategorySelect
          width="min-w-[40%] w-full"
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className=" w-full min-w-[40%] px-4 py-2 mx-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </header>
  );
};

export default Navbar;
