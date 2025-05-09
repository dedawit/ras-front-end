import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import SidebarSeller from "../ui/SideBarSeller";
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import Button2 from "../ui/Button2";
import CategorySelect from "../ui/CategorySelect";
import { ProductList } from "./ProductList";

// Main Product Dashboard Component
export const ProductDashboard: React.FC = () => {
  const { id: userId } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const navigate = useNavigate();

  const handleCreateProduct = () => {
    navigate("/products/create-product");
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="flex flex-1">
        <SidebarSeller />
        <div className="flex-1 flex flex-col">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            placeholder="Search Products..."
          />
          <MobileHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Products..."
          />
          <div className="px-4 mt-4 large-header flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <Button2
              icon={"icons/plus.svg"}
              text="Add Product"
              onClick={handleCreateProduct}
            />
          </div>
          <div className="px-4 mt-4 mobile-header">
            <Button2
              icon={"icons/plus.svg"}
              text="Add Product"
              onClick={handleCreateProduct}
              width="w-full"
            />
          </div>
          <main className="flex-1 p-6 h-screen overflow-y-auto">
            <ProductList
              userId={userId || ""}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
