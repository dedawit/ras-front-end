import { FC } from "react";
import { useNavigate } from "react-router-dom";
import Button2 from "../ui/Button2";
import { FaBuilding, FaMoneyBillWave } from "react-icons/fa";
import { Transaction } from "../../types/transaction";
import { Building, Coins } from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCardBuyer: FC<TransactionCardProps> = ({ transaction }) => {
  const navigate = useNavigate();
  const lastRole = localStorage.getItem("lastRole");
  const isSeller = lastRole === "seller";

  const handleViewClick = () => {
    navigate(`/transactions/view/${transaction.id}`);
  };

  // Format the date
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Format price in ETB
  const formattedPrice = transaction.bid.totalPrice.toLocaleString("en-ET", {
    style: "currency",
    currency: "ETB",
  });

  return (
    <div className="bg-white rounded-lg border-color p-4 space-y-4 shadow-sm">
      {/* Transaction ID and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
        <div className="space-y-1">
          <h3 className="sm:text-2xl font-extrabold text:sm">
            {transaction.transactionId}
          </h3>
          <div className="flex items-center space-x-2">
            <Building className="sm:w-10 sm:h-10 w-5 h-5 text-gray-700" />
            <p className="text-sm text-gray-600 sm:text-base">
              {isSeller
                ? transaction.bid.rfq?.createdBy.companyName
                : transaction.bid.createdBy.companyName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="actions flex items-center space-x-2">
            <Button2
              icon={"icons/eye.svg"}
              text="View "
              textClassName="sm:block hidden"
              width="200px"
              onClick={handleViewClick}
            />
          </div>
        </div>
      </div>

      {/* Total Price and Date */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-6">
          <div className="icon-text-container flex items-center space-x-2">
            <Coins className="sm:w-10 sm:h-10 w-5 h-5 text-gray-700" />
            <span className="font-medium text-select-color sm:text-lg text-xs">
              {formattedPrice}
            </span>
          </div>
          <div className="icon-text-container flex items-center space-x-2">
            <img
              src="icons/date.svg"
              alt="Date Icon"
              className="sm:w-10 sm:h-10 w-5 h-5"
            />
            <span className="font-medium text-select-color sm:text-lg text-xs">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCardBuyer;
