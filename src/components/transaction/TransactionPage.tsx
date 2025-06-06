import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import Footer from "../ui/Footer";
import { Spinner } from "../ui/Spinner";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { useUser } from "../../context/UserContext";
import { transactionService } from "../../services/transaction";
import { formatNumberWithCommas } from "../../utils/formatter";

interface TransactionData {
  transactionId: string;
  projectName: string;
  quantity: number;
  totalPrice: number;
  date: string;
  bidId: string;
}

const TransactionPage: React.FC = () => {
  const { id: userId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { notification, showNotification, hideNotification } =
    useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData>({
    transactionId: "",
    projectName: "",
    quantity: 0,
    totalPrice: 0,
    date: new Date().toISOString().slice(0, 16),
    bidId: "",
  });

  useEffect(() => {
    const fetchTransactionId = async () => {
      if (!userId) return;

      try {
        const generatedId = await transactionService.generateTransactionId(
          userId
        );
        setTransactionData((prev) => ({
          ...prev,
          transactionId: generatedId,
        }));
      } catch (error) {
        console.error("Failed to generate transaction ID:", error);
        showNotification(
          "error",
          "Failed to generate transaction ID. Please enter manually."
        );
      }
    };

    if (location.state?.bid) {
      const { bid } = location.state;
      setTransactionData((prev) => ({
        ...prev,
        projectName: bid.projectName || "",
        quantity: Number(bid.quantity) || 0,
        totalPrice: Number(bid.totalPrice) || 0,
        bidId: bid.id,
      }));

      fetchTransactionId(); // Generate ID when bid data is available
    } else {
      navigate("/bids");
    }
  }, [location.state, navigate, showNotification, userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof TransactionData
  ) => {
    setTransactionData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleProceedToPayment = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        throw new Error("User not logged in or invalid user ID");
      }
      if (!transactionData.transactionId.trim()) {
        throw new Error("Transaction ID is required");
      }
      if (!transactionData.bidId) {
        throw new Error("Invalid or missing Bid ID");
      }

      const response = await transactionService.createTransaction(userId, {
        transactionId: transactionData.transactionId.trim(),
        bidId: transactionData.bidId,
      });

      if (response.data.checkout_url) {
        showNotification("success", "Redirecting to payment...");
        setTimeout(() => {
          window.location.href = response.data.checkout_url;
        }, 2000);
      }
    } catch (err: any) {
      showNotification(
        "error",
        err.message || "Failed to process transaction. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        <MobileHeader showSearchIcon={false} />
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}

        <div className="sm:mt-20  md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
          <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
            Transaction Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction ID (Receipt Reference)
              </label>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={transactionData.transactionId}
                onChange={(e) => handleInputChange(e, "transactionId")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={transactionData.projectName}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                className="p-2 border rounded-md w-full sm:w-96"
                value={transactionData.quantity}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Total Price
              </label>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={formatNumberWithCommas(
                  Number(transactionData.totalPrice)
                )}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="datetime-local"
                className="p-2 border rounded-md w-full sm:w-96"
                value={transactionData.date}
                onChange={(e) => handleInputChange(e, "date")}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={() => navigate(-1)}
              >
                Back to Bid Detail
              </button>
              <button
                className="p-3 bg-primary-color text-white rounded-md hover:bg-blue-700"
                onClick={handleProceedToPayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
