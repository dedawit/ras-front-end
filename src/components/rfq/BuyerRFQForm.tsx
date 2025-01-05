import Button2 from "../ui/Button2";
import CategorySelect from "../ui/CategorySelect";
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import Sidebar from "../ui/SideBar";
import RFQList from "./RFQList";

export const BuyerRFQForm: React.FC = () => {
  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <MobileHeader />
        <div className="mobile-header ">
          <CategorySelect width="w-full" />
        </div>
        <div className="px-4 mt-4 large-header">
          <Button2
            icon={"icons/plus.svg"}
            text="Post RFQ"
            onClick={() => alert("Button clicked!")}
          />
        </div>
        <div className="px-4 mt-4 mobile-header">
          <Button2
            icon={"icons/plus.svg"}
            text="Post RFQ"
            onClick={() => alert("Button clicked!")}
            width="w-full"
          />
        </div>

        <main className="flex-1 p-6 ">
          <RFQList />
        </main>
      </div>
    </div>
  );
};
