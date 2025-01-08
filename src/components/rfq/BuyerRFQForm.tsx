import { useNavigate } from "react-router-dom";
import Button2 from "../ui/Button2";
import CategorySelect from "../ui/CategorySelect";
import Header from "../ui/Header";
import MobileHeader from "../ui/MobileHeader";
import Sidebar from "../ui/SideBar";
import RFQList from "./RFQList";
import { useUser } from "../../context/UserContext";

export const BuyerRFQForm: React.FC = () => {
  const navigate = useNavigate();
  const { id: buyerId } = useUser();

  const handlePostRFQ = () => {
    navigate("/rfqs/post-rfq");
  };
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
            onClick={handlePostRFQ}
          />
        </div>
        <div className="px-4 mt-4 mobile-header">
          <Button2
            icon={"icons/plus.svg"}
            text="Post RFQ"
            onClick={handlePostRFQ}
            width="w-full"
          />
        </div>

        <main className="flex-1 p-6 ">
          <RFQList buyerId={buyerId} />
        </main>
      </div>
    </div>
  );
};
