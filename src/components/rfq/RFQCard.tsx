import { FC } from "react";
import { RFQ } from "../../types/rfq";
import { RiEyeLine, RiEditLine } from "react-icons/ri";
import { Button } from "../ui/button";

interface RFQCardProps {
  rfq: RFQ;
}

const RFQCard: FC<RFQCardProps> = ({ rfq }) => {
  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{rfq.title}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RiEyeLine className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <RiEditLine className="w-4 h-4 mr-1" />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-gray-500">Quantity:</span>
          <span className="ml-2 font-medium">{rfq.quantity}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-500">Date:</span>
          <span className="ml-2 font-medium">{rfq.date}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{rfq.category}</span>
        </div>
        <Button variant="primary" size="sm">
          {rfq.quotes} View Quotes
        </Button>
      </div>
    </div>
  );
};

export default RFQCard;
