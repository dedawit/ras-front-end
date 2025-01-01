import Header from "../ui/Header";
import Sidebar from "../ui/SideBar";
import RFQList from "./RFQList";

export const BuyerRFQForm: React.FC = () => {
  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <RFQList />
        </main>
      </div>
    </div>
  );
};
