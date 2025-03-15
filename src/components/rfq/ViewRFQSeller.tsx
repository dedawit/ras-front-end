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
  const [rfq, setRfq] = useState<RFQ | null>(null);
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
          console.log(rfqData);
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

  // Handle back navigation
  const handleBack = () => {
    navigate("/rfqs");
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

        {/* Main Content (Shown After Fetch) */}
        {!isLoading && (
          <div className="my-5 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full ">
            <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
              View RFQ
            </h2>

            {/* Error State */}
            {error && <p className="text-center text-red-500">{error}</p>}

            {/* RFQ Data */}
            {rfq && !error && (
              <div className="space-y-4 ">
                {/* RFQ Status */}
                <div className="text-center mb-4">
                  {rfq.state === true ? (
                    <span className="inline-block px-4 py-2 text-white font-bold border border-green-600 bg-green-600 rounded-md w-full">
                      Open
                    </span>
                  ) : (
                    <span className="inline-block px-4 py-2 text-white font-bold border border-red-600 bg-red-600 rounded-md w-full">
                      Closed
                    </span>
                  )}
                </div>

                {/* RFQ Details */}
                <FormField label="Product Name">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.productName}
                    readOnly
                  />
                </FormField>

                <FormField label="Category">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.category}
                    readOnly
                  />
                </FormField>

                <FormField label="Quantity">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={rfq.quantity}
                    readOnly
                  />
                </FormField>

                <FormField label="Details">
                  <textarea
                    className="w-full sm:w-96 p-2 border rounded-md h-24 bg-gray-100"
                    value={rfq.detail || "No additional details"}
                    readOnly
                  />
                </FormField>

                <FormField label="Deadline">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={
                      rfq.deadline
                        ? new Date(rfq.deadline).toLocaleDateString()
                        : "Not set"
                    }
                    readOnly
                  />
                </FormField>

                <FormField label="Date ">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96 bg-gray-100"
                    value={
                      rfq.createdAt
                        ? new Date(rfq.createdAt).toLocaleDateString()
                        : "N/A"
                    }
                    readOnly
                  />
                </FormField>
                {/* File Download */}
                {rfq.fileUrl && (
                  <FormField label="Attached File">
                    <a
                      href={rfq.fileUrl}
                      download
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
                      Download File
                    </a>
                  </FormField>
                )}

                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="w-full p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 mt-6"
                >
                  Back to RFQ List
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRFQSeller;
