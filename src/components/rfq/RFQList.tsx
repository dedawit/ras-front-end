import { FC, useEffect, useState } from "react";
import RFQCard from "./RFQCard";
import { RFQ } from "../../types/rfq";
import { rfqService } from "../../services/rfq"; // Import the rfqService to fetch data
import { Spinner } from "../ui/Spinner";

interface RFQListProps {
  buyerId: any;
  searchTerm: string; // Add searchTerm as prop
  selectedCategory: string; // Add selectedCategory as prop
}

const RFQList: FC<RFQListProps> = ({
  buyerId,
  searchTerm = "",
  selectedCategory = "All Categories",
}) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // State to manage the loading spinner

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        setLoading(true);
        const data = await rfqService.getRFQs(buyerId);
        setRfqs(data.reverse()); // Reverse the data to show the newest first
      } catch (error) {
        console.error("Failed to load RFQs:", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchRFQs();
  }, [buyerId]); // Re-fetch RFQs when buyerId changes

  const filteredRFQs = rfqs.filter((rfq) => {
    console.log(searchTerm);
    const matchesCategory =
      selectedCategory === "All Categories" ||
      rfq.category === selectedCategory;
    const matchesSearch = rfq.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
        <Spinner className="border-primary-color" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scrollable container with hidden scrollbar and vertical spacing */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-none space-y-4 custom-scroll">
        {filteredRFQs.map((rfq) => (
          <RFQCard key={rfq.id} rfq={rfq} />
        ))}
      </div>
    </div>
  );
};

export default RFQList;
