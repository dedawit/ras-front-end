import { FC, useEffect, useState } from "react";
import BidCard from "./BidCard";
import { Bid } from "../../types/bid";
import { bidService } from "../../services/bid";
import { Spinner } from "../ui/Spinner";
import BidBuyerCard from "./BidBuyerCard";

interface BidListProps {
  sellerId?: string; // Optional for seller
  rfqId?: string; // Optional for buyer
  searchTerm: string;
  selectedCategory: string;
}

const BidList: FC<BidListProps> = ({
  sellerId,
  rfqId,
  searchTerm = "",
  selectedCategory = "All Categories",
}) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const role = localStorage.getItem("lastRole");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        let data: Bid[] = [];

        if (role === "seller" && sellerId) {
          data = await bidService.getBidsBySeller(sellerId);
        } else if (role === "buyer" && rfqId) {
          data = await bidService.getBidsByRFQ(rfqId);
        }
        console.log(data);
        setBids(data);
      } catch (error) {
        console.error("Failed to load bids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [role, sellerId, rfqId]);

  const filteredBids = bids.filter((bid) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      bid.rfq.category === selectedCategory;
    const matchesSearch = bid.rfq.purchaseNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItems = filteredBids.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBids = filteredBids.slice(startIndex, startIndex + itemsPerPage);

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
      {/* Bid List */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-none space-y-4 custom-scroll">
        {currentBids.length > 0 ? (
          currentBids.map((bid) =>
            role === "buyer" ? (
              <BidBuyerCard key={bid.id} bid={bid} />
            ) : (
              <BidCard key={bid.id} bid={bid} />
            )
          )
        ) : (
          <p className="text-center text-gray-500">No bids found</p>
        )}
      </div>

      {/* Pagination */}
      {totalItems > itemsPerPage && (
        <div className="flex justify-center items-center space-x-2 mt-4">
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
  );
};

export default BidList;
