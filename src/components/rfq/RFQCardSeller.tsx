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

  return (
    <div className="bg-white rounded-lg border-color p-4 space-y-4 shadow-sm">
      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <h3 className="sm:text-2xl font-extrabold text:sm">
          {rfq.productName}
        </h3>
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
            <span className="font-medium text-select-color sm:text-lg text-xs">
              {new Date(rfq.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
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
