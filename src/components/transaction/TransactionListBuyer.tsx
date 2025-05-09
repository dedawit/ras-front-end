import { FC, useEffect, useState } from "react";
import { Spinner } from "../ui/Spinner";
import { transactionService } from "../../services/transaction";
import TransactionCardBuyer from "./TransactionCardBuyer";
import { Transaction } from "../../types/transaction";

interface TransactionListProps {
  buyerId: string;
  searchTerm?: string;
}

const TransactionBuyerList: FC<TransactionListProps> = ({
  buyerId,
  searchTerm = "",
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        let data: Transaction[] = [];

        const lastRole = localStorage.getItem("lastRole");
        if (lastRole === "seller") {
          // Fetch transactions for sellers
          const sellerTransactions =
            await transactionService.getTransactionsSeller(buyerId);
          data = sellerTransactions.map((t) => ({
            transactionId: t.transactionId,
            companyName: t.bid?.rfq?.createdBy?.companyName || "",
            totalPrice: t.bid?.totalPrice || 0,
            date: t.date,
            id: t.id, // Ensure 'id' is included
            bid: t.bid, // Ensure 'bid' is included
          }));
        } else {
          // Fetch transactions for buyers
          const buyerTransactions = await transactionService.getTransactions(
            buyerId
          );
          data = buyerTransactions.map((t) => ({
            transactionId: t.transactionId,
            companyName: t.bid?.createdBy?.companyName || "",
            totalPrice: t.bid?.totalPrice || 0,
            date: t.date,
            id: t.id, // Ensure 'id' is included
            bid: t.bid, // Ensure 'bid' is included
          }));
        }
        console.log(data);

        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [buyerId]);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

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
      {/* Transaction List */}
      <div className="max-h-[600px] overflow-y-auto scrollbar-none space-y-4 custom-scroll">
        {currentTransactions.length > 0 ? (
          currentTransactions.map((transaction) => (
            <TransactionCardBuyer
              key={transaction.transactionId}
              transaction={transaction}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions found</p>
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

export default TransactionBuyerList;
