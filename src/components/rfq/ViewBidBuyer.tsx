import React, { useEffect, useState } from "react";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { Bid, BidItem } from "../../types/bid";
import { bidService } from "../../services/bid";
import AwardButton from "../ui/AwardButton";
import { formatNumberWithCommas } from "../../utils/formatter";

const ViewBid: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const { notification, showNotification, hideNotification } =
    useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Bid | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchBid = async () => {
      if (!id) {
        showNotification("error", "No bid ID provided");
        return;
      }

      setIsLoading(true);
      try {
        const bidData = await bidService.viewBid(id);
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

  const handleMakeTransaction = () => {
    if (formData) {
      navigate("/transactions/make", {
        state: {
          bid: {
            id: id,
            projectName: formData.rfq.projectName,
            quantity: formData.rfq.quantity,
            totalPrice: formData.totalPrice,
          },
        },
      });
    }
  };

  const handleAwardBid = async () => {
    if (!id) {
      showNotification("error", "No bid ID provided");
      return;
    }

    setIsLoading(true);
    try {
      await bidService.awardBid(id);
      showNotification("success", "Bid awarded successfully!");
      setFormData((prev) => (prev ? { ...prev, state: "awarded" } : prev));
      setShowModal(false);
    } catch (err: any) {
      showNotification(
        "error",
        err.message || "Failed to award bid. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (bidId: string, filePath: string) => {
    try {
      const filename = extractFilename(filePath);
      await bidService.downloadBidFile(bidId, filename);
    } catch (err) {
      setError("Failed to download file");
    }
  };

  const extractFilename = (filePath: string): string => {
    const parts = filePath.split("/");
    return parts[parts.length - 1];
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent w-full">
      <div className="fixed top-0 left-0 h-full w-64 hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col w-full md:ml-64">
        <MobileHeader showSearchIcon={false} />

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

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Items</h3>
                  <p className="text-primary-color font-semibold">
                    Total Bid: ETB{" "}
                    {formatNumberWithCommas(Number(formData.totalPrice))}
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
                              <td className="p-2 border">
                                ETB{" "}
                                {formatNumberWithCommas(
                                  Number(item.singlePrice)
                                )}
                              </td>
                              <td className="p-2 border">
                                ETB{" "}
                                {formatNumberWithCommas(
                                  Number(item.transportFee || 0)
                                )}
                              </td>
                              <td className="p-2 border">
                                ETB{" "}
                                {formatNumberWithCommas(
                                  Number(item.taxes || 0)
                                )}
                              </td>
                              <td className="p-2 border">
                                ETB{" "}
                                {formatNumberWithCommas(
                                  Number(item.totalPrice)
                                )}
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

              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="max-w-64 p-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                >
                  Back to Bids
                </button>
                {formData.state !== "rejected" &&
                formData.transactions?.length === 0 ? (
                  <>
                    {formData.state === "awarded" ? (
                      <button
                        onClick={handleMakeTransaction}
                        className="max-w-64 p-3 text-white bg-primary-color rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                      >
                        Make Transaction
                      </button>
                    ) : formData.state === "closed" ? (
                      <AwardButton
                        isAwarding={isLoading}
                        setShowModal={setShowModal}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Award Bid</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to award this bid? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAwardBid}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Awarding..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBid;
