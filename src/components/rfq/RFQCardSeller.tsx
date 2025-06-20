import { FC } from "react";
import { RFQ } from "../../types/rfq";
import { RiEyeLine, RiEditLine, RiMore2Line } from "react-icons/ri";
import { Button } from "../ui/Button";
import Button2 from "../ui/Button2";
import { useNavigate } from "react-router-dom";

interface RFQCardProps {
  rfq: RFQ;
}

const RFQCardSeller: FC<RFQCardProps> = ({ rfq }) => {
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/rfq-seller/view-rfq/${rfq.id}`);
  };

  // Determine status color
  const getStatusColor = (state: string) => {
    switch (state.toLowerCase()) {
      case "opened":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "awarded":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border-color p-4 space-y-4 shadow-sm">
      {/* Title, Product Name and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="sm:text-2xl font-extrabold text:sm">
            {rfq.purchaseNumber}
          </h3>
          <p className="text-sm text-gray-600 sm:text-base">
            {rfq.title || "N/A"}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          {/* Status Box */}
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              rfq.state || "opened"
            )}`}
          >
            {rfq.state || "Opened"}
          </span>
          <div className="actions flex items-center space-x-2">
            <Button2
              icon={"icons/eye.svg"}
              text="View"
              textClassName="sm:block hidden"
              width="200px"
              onClick={handleViewClick}
            />
          </div>
        </div>
      </div>

      {/* Quantity, Date, and Category */}
      <div className="flex items-center justify-between">
        {/* Left: Quantity and Date */}
        <div className="flex space-x-6">
          <div className="icon-text-container flex items-center space-x-2">
            <img
              src="icons/quantity.svg"
              alt="Quantity Icon"
              className="sm:w-10 sm:h-10 w-5 h-5"
            />
            <span className="font-medium text-select-color sm:text-lg text-xs">
              {rfq.quantity}
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
                rfq.deadline && new Date(rfq.deadline) >= new Date()
                  ? "text-red-500"
                  : "text-select-color"
              }`}
            >
              {rfq.deadline
                ? (() => {
                    const deadlineDate = new Date(rfq.deadline);
                    const today = new Date();
                    // Set today to start of day for comparison
                    today.setHours(0, 0, 0, 0);
                    deadlineDate.setHours(0, 0, 0, 0);
                    const timeDiff = deadlineDate.getTime() - today.getTime();
                    const daysLeft = Math.ceil(
                      timeDiff / (1000 * 60 * 60 * 24)
                    );

                    // Check if deadline is today or in the future
                    if (new Date(rfq.deadline) >= new Date()) {
                      return daysLeft >= 0
                        ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                        : "Today";
                    }
                    // For expired deadlines, show formatted date
                    return new Date(rfq.deadline).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    });
                  })()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Right: Category */}
        <div className="icon-text-container flex items-center space-x-2 text-gray-500">
          <img
            src="icons/category.svg"
            alt="Category Icon"
            className="sm:w-10 sm:h-10 w-5 h-5"
          />
          <span className="font-medium sm:text-lg text-primary-color text-xs">
            {rfq.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RFQCardSeller;
