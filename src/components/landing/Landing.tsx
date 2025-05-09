import React, { useState } from "react";
import { ProductList } from "./ProductList";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

const Landing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const navigate = useNavigate();

  // Add onLoginClick handler
  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen ">
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onLoginClick={handleLoginClick} // Pass the handler
      />
      <main className="container mx-auto px-4 py-8">
        <ProductList
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
      </main>
    </div>
  );
};

export default Landing;
