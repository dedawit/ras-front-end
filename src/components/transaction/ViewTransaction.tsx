import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import SidebarSeller from "../ui/SideBarSeller";
import { Spinner } from "../ui/Spinner";
import FormField from "../common/FormField";
import FeedbackModal from "./FeedbackModal";
import FeedbackList from "./FeedbackList";
import {
  SingleTransaction,
  transactionService,
} from "../../services/transaction";
import { Feedback } from "../../types/feedback";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { useUser } from "../../context/UserContext"; // Import useUser
import { feedbackService } from "../../services/feeback";

const ViewTransaction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<SingleTransaction | null>(
    null
  );
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();
  const { id: userId } = useUser(); // Get userId from useUser
  const lastRole = localStorage.getItem("lastRole");
  const isSeller = lastRole === "seller";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (id) {
          let transactionData: SingleTransaction;

          if (isSeller) {
            const sellerTransaction =
              await transactionService.getTransactionById(id);
            transactionData = {
              transactionId: sellerTransaction.transactionId,
              projectName: sellerTransaction.projectName || "",
              companyName: sellerTransaction.companyNameBuyer || "",
              quantity: sellerTransaction.quantity || 0,
              totalPrice: sellerTransaction.totalPrice || 0,
              date: sellerTransaction.date,
            };
          } else {
            transactionData = await transactionService.getTransactionById(id);
          }

          setTransaction(transactionData);

          // Fetch feedbacks
          const feedbackData =
            await feedbackService.getFeedbacksByTransactionId(id);
          setFeedbacks(feedbackData);
        } else {
          setError("Invalid Transaction ID");
        }
      } catch (error: any) {
        setError("Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isSeller]);

  const handleAddFeedback = async (feedbackData: {
    transactionId: string;
    createdBy: string;
    comment: string;
    star: number;
  }) => {
    try {
      await feedbackService.createFeedback(feedbackData);
      const updatedFeedbacks =
        await feedbackService.getFeedbacksByTransactionId(id!);
      setFeedbacks(updatedFeedbacks);
      showNotification("success", "Feedback added successfully!");
    } catch (error: any) {
      showNotification("error", "Failed to add feedback. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/transactions");
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      {isSeller ? <SidebarSeller /> : <Sidebar />}
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        <MobileHeader showSearchIcon={false} />
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-16 w-16 border-4" />
          </div>
        )}

        {!isLoading && (
          <div className="mt-4 sm:mt-24 md:max-w-2xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full w-full">
            <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
              View Transaction
            </h2>

            {error && <p className="text-center text-red-500">{error}</p>}

            {transaction && !error && (
              <div className="space-y-4">
                <FormField label="Transaction ID">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={transaction.transactionId || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Project Name">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={transaction.projectName || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Company Name">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={transaction.companyName || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Quantity">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={transaction.quantity || 0}
                    readOnly
                  />
                </FormField>

                <FormField label="Total Price">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={
                      transaction.totalPrice
                        ? `ETB: ${transaction.totalPrice.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : "ETB: 0.00"
                    }
                    readOnly
                  />
                </FormField>

                <FormField label="Date">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={
                      transaction.date
                        ? new Date(transaction.date).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"
                    }
                    readOnly
                  />
                </FormField>

                <div className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-6">
                  <button
                    onClick={handleBack}
                    className="w-full sm:w-auto p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Back to Transaction List
                  </button>
                  <button
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="w-full sm:w-auto p-3 bg-primary-color text-white rounded-md hover:bg-blue-700"
                  >
                    Add Feedback
                  </button>
                </div>

                {/* Expandable Feedback Section */}
                <div className="mt-6">
                  <button
                    onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
                    className="flex items-center justify-between w-full p-3 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      Feedback ({feedbacks.length})
                    </span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        isFeedbackExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isFeedbackExpanded && (
                    <div className="mt-4">
                      <FeedbackList feedbacks={feedbacks} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {isFeedbackModalOpen && userId && (
              <FeedbackModal
                transactionId={id!}
                userId={userId} // Pass userId
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmit={handleAddFeedback}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewTransaction;
