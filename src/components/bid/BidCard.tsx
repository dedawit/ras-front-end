import { FC } from "react";
import { Bid } from "../../types/bid";
import { useNavigate } from "react-router-dom";
import Button2 from "../ui/Button2";
import { Coins, Package } from "lucide-react";

interface BidCardProps {
  bid: Bid;
}

const BidCard: FC<BidCardProps> = ({ bid }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/bids/view-bid/${bid.id}`);
  };

  const handleEditClick = () => {
    navigate(`/bids/edit-bid/${bid.id}`);
  };

  // Status color logic (you might want to adjust based on your bid states)
  const getStatusColor = (state: string = "opened") => {
    switch (state.toLowerCase()) {
      case "opened":
        return "bg-green-100 text-green-800";
      case "rejected":
      case "closed":
        return "bg-red-100 text-red-800";
      case "awareded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border-color p-4 space-y-4 shadow-sm">
      {/* Bid ID and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="sm:text-2xl font-extrabold text:sm">
            {bid.rfq.purchaseNumber}
          </h3>
          <p className="text-sm text-gray-600 sm:text-base"> {bid.rfq.title}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              bid.state // Assuming you add a state field to Bid interface
            )}`}
          >
            {bid.state}
          </span>
          <div className="actions flex items-center space-x-2">
            <Button2
              icon={"icons/eye.svg"}
              text="View"
              textClassName="sm:block hidden"
              width="200px"
              onClick={handleViewClick}
            />
            <Button2
              icon={"icons/edit.svg"}
              text="Edit"
              textClassName="sm:block hidden"
              width="200px"
              onClick={handleEditClick}
            />
          </div>
        </div>
      </div>

      {/* Bid Details */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          <div className="icon-text-container flex items-center space-x-2">
            <Coins className="sm:w-10 sm:h-10 w-5 h-5 text-gray-700" />
            <span className="font-medium sm:text-lg text-primary-color text-xs">
              ETB: {Number(bid.totalPrice).toFixed(2)}
            </span>
          </div>
          <div className="icon-text-container flex items-center space-x-2">
            <img
              src="icons/date.svg"
              alt="Date Icon"
              className="sm:w-10 sm:h-10 w-5 h-5"
            />
            <span
              className={`font-medium sm:text-lg text-xs ${
                bid.rfq.deadline && new Date(bid.rfq.deadline) >= new Date()
                  ? "text-red-500"
                  : "text-select-color"
              }`}
            >
              {bid.rfq.deadline
                ? (() => {
                    const deadlineDate = new Date(bid.rfq.deadline);
                    const today = new Date();
                    const timeDiff = deadlineDate.getTime() - today.getTime();
                    const daysLeft = Math.ceil(
                      timeDiff / (1000 * 60 * 60 * 24)
                    ); // Convert ms to days
                    return daysLeft >= 0
                      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                      : new Date(bid.rfq.deadline).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        });
                  })()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Total Price */}
        {/* <div className="icon-text-container flex items-center space-x-2 text-gray-500">
          <Coins className="sm:w-10 sm:h-10 w-5 h-5 text-gray-700" />
          <span className="font-medium sm:text-lg text-primary-color text-xs">
            ETB: {Number(bid.totalPrice).toFixed(2)}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default BidCard;
