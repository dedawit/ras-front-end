import { FC, useEffect, useState } from "react";
import RFQCardSeller from "./RFQCardSeller";
import { RFQ } from "../../types/rfq";
import { rfqService } from "../../services/rfq";
import { Spinner } from "../ui/Spinner";

interface RFQListProps {
  sellerId: any;
  searchTerm: string;
  selectedCategory: string;
}

const RFQListSeller: FC<RFQListProps> = ({
  sellerId,
  searchTerm = "",
  selectedCategory = "All Categories",
}) => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        setLoading(true);
        const data = await rfqService.getRFQsSeller(sellerId);
        setRfqs(data); // Reverse to show newest first
      } catch (error) {
        console.error("Failed to load RFQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRFQs();
  }, [sellerId]);

  // Filter RFQs based on search term and category
  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      rfq.category === selectedCategory;
    const matchesSearch = rfq.purchaseNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalItems = filteredRFQs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRFQs = filteredRFQs.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner color="border-blue-500" className="h-24 w-24 border-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* RFQ List */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-none space-y-4 custom-scroll">
        {currentRFQs.length > 0 ? (
          currentRFQs.map((rfq) => <RFQCardSeller key={rfq.id} rfq={rfq} />)
        ) : (
          <p className="text-center text-gray-500">No RFQs found</p>
        )}
        {/* Pagination Controls */}
        {totalItems > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-color text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === page
                        ? "bg-primary-color text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary-color text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFQListSeller;
