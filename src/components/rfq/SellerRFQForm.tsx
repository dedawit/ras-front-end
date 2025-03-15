import { useNavigate } from "react-router-dom";
import Button2 from "../ui/Button2";
import CategorySelect from "../ui/CategorySelect";
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import Sidebar from "../ui/SideBar";
import RFQList from "./RFQList";
import { useUser } from "../../context/UserContext";
import { useState } from "react";
import Footer from "../ui/Footer";
import SidebarSeller from "../ui/SideBarSeller";
import RFQListSeller from "./RFQListSeller";

export const SellerRFQForm: React.FC = () => {
  const navigate = useNavigate();
  const { id: sellerId } = useUser();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");

  const handlePostRFQ = () => {
    navigate("/rfqs/post-rfq");
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="flex flex-1 overflow-auto">
        {" "}
        {/* Prevents full-page scrolling */}
        <SidebarSeller />
        <div className="flex-1 flex flex-col">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <MobileHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="mobile-header">
            <CategorySelect
              width="w-full"
              value={selectedCategory}
              onChange={(category) => setSelectedCategory(category)}
            />
          </div>

          {/* Ensure the main content scrolls but not the whole page */}
          <main className="flex-1 p-6 overflow-auto">
            <RFQListSeller
              sellerId={sellerId}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
            />
          </main>
        </div>
      </div>
    </div>
  );
};
