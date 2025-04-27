import { FC, useState } from "react";
import Sidebar from "../ui/SideBar";
import SideBarSeller from "../ui/SideBarSeller"; // Import seller sidebar
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import { useUser } from "../../context/UserContext";
import Button2 from "../ui/Button2";
import TransactionBuyerList from "./TransactionListBuyer";

export const TransactionHistoryBuyer: FC = () => {
  const { id: buyerId } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const lastRole = localStorage.getItem("lastRole");
  const isSeller = lastRole === "seller";

  const handleView = () => {
    // Placeholder for future implementation
    console.log("View button clicked - to be implemented");
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      <div className="flex flex-1 overflow-hidden">
        {isSeller ? <SideBarSeller /> : <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Transaction..."
          />
          <MobileHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search Transaction..."
          />
          {/* <div className="px-4 mt-4 large-header">
            <Button2 icon={"icons/eye.svg"} text="View" onClick={handleView} />
          </div>
          <div className="px-4 mt-4 mobile-header">
            <Button2
              icon={"icons/eye.svg"}
              text="View"
              onClick={handleView}
              width="w-full"
            />
          </div> */}

          {/* Main content with scrolling */}
          <main className="flex-1 p-6 overflow-auto">
            <h1 className="text-3xl font-bold mb-4">Transaction History</h1>
            <TransactionBuyerList
              buyerId={buyerId || ""}
              searchTerm={searchTerm}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryBuyer;
