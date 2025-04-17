import React, { useEffect, useState } from "react";
import SidebarSeller from "../ui/SideBarSeller";
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { Bid, BidItem } from "../../types/bid";
import { bidService } from "../../services/bid"; // Adjust path
import Sidebar from "../ui/SideBar";

const ViewBidBuyer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); // id is string | undefined
  const [error, setError] = useState<string | null>(null);

  const { notification, showNotification, hideNotification } =
    useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Bid | null>(null);

  // Fetch bid data when component mounts
  useEffect(() => {
    const fetchBid = async () => {
      if (!id) {
        showNotification("error", "No bid ID provided");
        // navigate("/bids");
        return;
      }

      setIsLoading(true);
      try {
        const bidData = await bidService.viewBid(id); // id is guaranteed to be string here
        setFormData(bidData);
      } catch (err: any) {
        showNotification(
          "error",
          err.message || "Failed to fetch bid. Please try again."
        );
        console.error("Error fetching bid:", err);
        navigate("/bids");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBid();
  }, [id, navigate, showNotification]);

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // Handle file download
  const handleDownload = async (bidId: string, filePath: string) => {
    try {
      const filename = extractFilename(filePath);
      await bidService.downloadBidFile(bidId, filename);
    } catch (err) {
      setError("Failed to download file");
    }
  };

  // Extract filename from full path
  const extractFilename = (filePath: string): string => {
    const parts = filePath.split("/");
    return parts[parts.length - 1]; // Get the last part after the last slash
  };

  return (
    <div className="flex min-h-screen bg-transparent w-full">
      <div className="fixed top-0 left-0 h-full w-64 hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col w-full md:ml-64">
        <MobileHeader showSearchIcon={false} />

        {/* Notification Display */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="mt-8 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
            <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
              View Bid for {formData.rfq.purchaseNumber || "Unknown"}
            </h2>

            <div className="space-y-6">
              {/* Display Bid Documents */}
              <div className="flex items-center gap-3">
                <label className="text-base font-medium text-gray-700">
                  Bid Documents:
                </label>
                {formData.files && typeof formData.files === "string" ? (
                  <button
                    onClick={() => {
                      if (id) {
                        handleDownload(id, formData.files as string);
                      } else {
                        setError("Bid ID is missing");
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-base text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
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
                    Download Bid Doc
                  </button>
                ) : (
                  <p className="text-base text-gray-500 italic">
                    No files attached
                  </p>
                )}
                {error && <p className="text-red-500 text-base">{error}</p>}
              </div>

              {/* Display Bid Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Items</h3>
                  <p className="text-primary-color font-semibold">
                    Total Bid: ETB: {formData.totalPrice || 0}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Item</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Unit</th>
                        <th className="p-2 border">Single Price</th>
                        <th className="p-2 border">Transport Fee</th>
                        <th className="p-2 border">Taxes</th>
                        <th className="p-2 border">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.bidItems.length > 0 ? (
                        formData.bidItems.map(
                          (item: BidItem, index: number) => (
                            <tr key={index}>
                              <td className="p-2 border">{item.item}</td>
                              <td className="p-2 border">{item.quantity}</td>
                              <td className="p-2 border">{item.unit}</td>
                              <td className="p-2 border">{item.singlePrice}</td>
                              <td className="p-2 border">
                                {item.transportFee || 0}
                              </td>
                              <td className="p-2 border">{item.taxes || 0}</td>
                              <td className="p-2 border">
                                ETB:{item.totalPrice}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-2 border text-center">
                            No items available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Back Button */}

              <button
                onClick={() => navigate(-1)}
                className="max-w-64 p-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
              >
                Back to Bids
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBidBuyer;
