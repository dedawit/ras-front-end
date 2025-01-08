import { FC, useEffect, useState } from "react";
import RFQCard from "./RFQCard";
import { RFQ } from "../../types/rfq";
import { rfqService } from "../../services/rfq"; // Import the rfqService to fetch data
import { Spinner } from "../ui/Spinner";

interface RFQListProps {
  buyerId: any; // Assuming buyerId is passed as a prop
}

const RFQList: FC<RFQListProps> = ({ buyerId }) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to manage the loading spinner

  // Fetch RFQs from the API
  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const data = await rfqService.getRFQs(buyerId);
        setRfqs(data); // Set the fetched RFQs into state
      } catch (error) {
        console.error("Failed to load RFQs:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchRFQs();
  }, [buyerId]); // Re-fetch RFQs when buyerId changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rfqs.map((rfq) => (
        <RFQCard key={rfq.id} rfq={rfq} />
      ))}
    </div>
  );
};

export default RFQList;
