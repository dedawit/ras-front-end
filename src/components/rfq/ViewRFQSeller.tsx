import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { rfqService } from "../../services/rfq";
import { RFQ } from "../../types/rfq";
import FormField from "../common/FormField";
import SidebarSeller from "../ui/SideBarSeller";

const ViewRFQSeller: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rfq, setRfq] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch RFQ data on mount
  useEffect(() => {
    const fetchRFQ = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const rfqData = await rfqService.viewRFQ(id);
          // console.log(rfqData);
          setRfq(rfqData);
        } else {
          setError("Invalid RFQ ID");
        }
      } catch (error: any) {
        setError("Error fetching RFQ data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRFQ();
  }, [id]);

  const handleBid = () => {
    navigate(`/rfq-seller/bid/${rfq?.id}`);
  };

  // Determine status color and text
  const getStatusStyles = (state: string | boolean) => {
    const status = typeof state === "string" ? state.toLowerCase() : state;
    switch (status) {
      case "opened":
      case true:
        return {
          text: "Opened",
          className: "bg-green-100 text-green-800 border-green-600",
        };
      case "closed":
      case false:
        return {
          text: "Closed",
          className: "bg-red-100 text-red-800 border-red-600",
        };
      case "awarded":
        return {
          text: "Awarded",
          className: "bg-yellow-100 text-yellow-800 border-yellow-600",
        };
      default:
        return {
          text: "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-600",
        };
    }
  };

  // Extract filename from full path
  const extractFilename = (filePath: string | undefined): string => {
    if (!filePath) return "";
    const parts = filePath.split("/");
    return parts[parts.length - 1]; // Get the last part after the last slash
  };

  // Handle file download
  const handleDownload = async (rfqId: string, filePath: string) => {
    try {
      const filename = extractFilename(filePath);
      await rfqService.downloadRFQFile(rfqId, filename);
    } catch (err) {
      setError("Failed to download file");
    }
  };

  // Check if user has already placed a bid
  const hasUserBid = () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !rfq || !rfq.bids) return false;
    return rfq.bids.some((bid: any) => bid.createdBy.id === userId);
  };

  // Get the bid ID for the user's bid
  const getUserBidId = () => {
    const userId = localStorage.getItem("userId");
    if (!userId || !rfq || !rfq.bids) return null;
    const userBid = rfq.bids.find((bid: any) => bid.createdBy.id === userId);
    return userBid ? userBid.id : null;
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <SidebarSeller />
      <div className="flex-1 flex flex-col w-full">
        <MobileHeader showSearchIcon={false} />

        {/* Loading Spinner (Outside Main Content) */}
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-16 w-16 border-4" />
          </div>
        )}

        {!isLoading && (
          <div className="mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full overflow-y-auto">
            <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
              View RFQ
            </h2>

            {error && <p className="text-center text-red-500">{error}</p>}

            {rfq && !error && (
              <div className="space-y-4">
                {/* RFQ Status */}
                <div className="text-center mb-4">
                  <span
                    className={`inline-block px-4 py-2 font-bold rounded-full text-sm ${
                      getStatusStyles(rfq.state || "unknown").className
                    }`}
                  >
                    {getStatusStyles(rfq.state || "unknown").text}
                  </span>
                </div>

                {/* RFQ Details */}
                <FormField label="Title">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.title || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Project Name">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.projectName || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Purchase Number">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.purchaseNumber || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Category">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.category || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Quantity">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.quantity || ""}
                    readOnly
                  />
                </FormField>

                <FormField label="Deadline">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={
                      rfq.deadline
                        ? new Date(rfq.deadline).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Not set"
                    }
                    readOnly
                  />
                </FormField>

                <FormField label="Created Date">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={
                      rfq.createdAt
                        ? new Date(rfq.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"
                    }
                    readOnly
                  />
                </FormField>

                {/* File Downloads */}
                <FormField label="Auction Document">
                  <button
                    onClick={() =>
                      typeof rfq.auctionDoc === "string" &&
                      handleDownload(rfq.id, rfq.auctionDoc)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v12m0 0l-4-4m4 4l4-4M4 16h16"
                      />
                    </svg>
                    Download Auction Doc
                  </button>
                </FormField>

                <FormField label="Guideline Document">
                  <button
                    onClick={() =>
                      typeof rfq.guidelineDoc === "string" &&
                      handleDownload(rfq.id, rfq.guidelineDoc)
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v12m0 0l-4-4m4 4l4-4M4 16h16"
                      />
                    </svg>
                    Download Guideline Doc
                  </button>
                </FormField>

                <FormField label="Details">
                  <textarea
                    className="w-full sm:w-96 p-2 border rounded-md h-24 bg-gray-100"
                    value={rfq.detail || "No additional details"}
                    readOnly
                  />
                </FormField>

                {rfq.state === "opened" && (
                  <button
                    onClick={() => {
                      if (hasUserBid()) {
                        const bidId = getUserBidId();
                        navigate(`/bids/view-bid/${bidId}`, {
                          state: {
                            purchaseNumber: rfq.purchaseNumber,
                            rfqId: rfq.id,
                          },
                        });
                      } else {
                        navigate(`/bids/single/${rfq?.id}`, {
                          state: {
                            purchaseNumber: rfq.purchaseNumber,
                            rfqId: rfq.id,
                          },
                        });
                      }
                    }}
                    className="max-w-64 w-full p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 mt-4"
                  >
                    {hasUserBid() ? "View Bid" : "Bid Now"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRFQSeller;
