import React, { useEffect, useState } from "react";
import FormField from "../common/FormField";
import FileUpload from "../common/FileUpload";
import CategorySelect from "../ui/CategorySelect";
import SubmitButton from "../common/SubmitButton";
import { RFQ } from "../../types/rfq";
import Sidebar from "../ui/SideBar";
import { rfqService } from "../../services/rfq";
import { useUser } from "./../../context/UserContext";
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { useNavigate } from "react-router-dom";
import Footer from "../ui/Footer";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";

const PostRFQ: React.FC = () => {
  const { id: userId } = useUser();
  const [formData, setFormData] = useState<RFQ>({
    id: "",
    title: "",
    projectName: "",
    purchaseNumber: "",
    category: "Electronics and Electrical Equipment",
    quantity: "",
    detail: "",
    auctionDoc: null,
    guidelineDoc: null,
    deadline: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    projectName: "",
    purchaseNumber: "",
    quantity: "",
    detail: "",
    auctionDoc: "",
    guidelineDoc: "",
    deadline: "",
  });
  const { notification, showNotification, hideNotification } =
    useNotification();

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch generated purchase number on mount
  useEffect(() => {
    const fetchPurchaseNumber = async () => {
      if (!userId) {
        console.error("User ID not available");
        return;
      }
      try {
        const purchaseNumber = await rfqService.getGeneratedPurchaseNumber(
          userId
        );
        setFormData((prev) => ({ ...prev, purchaseNumber }));
      } catch (error) {
        console.error("Failed to fetch purchase number:", error);
        showNotification("error", "Failed to load purchase number.");
      }
    };

    fetchPurchaseNumber();
  }, [userId, showNotification]);

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.projectName)
      newErrors.projectName = "Project name is required";
    if (!formData.purchaseNumber)
      newErrors.purchaseNumber = "Purchase number is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";

    if (!formData.auctionDoc)
      newErrors.auctionDoc = "Auction document is required";
    if (!formData.guidelineDoc)
      newErrors.guidelineDoc = "Guideline document is required";
    if (!formData.deadline)
      newErrors.deadline = "Deadline date and time are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        if (!userId) {
          console.error("User not logged in or invalid user ID");
          return;
        }

        const buyerId = userId;
        const rfqData = {
          title: formData.title,
          projectName: formData.projectName,
          purchaseNumber: formData.purchaseNumber,
          category: formData.category,
          quantity: Number(formData.quantity),
          detail: formData.detail,
          auctionDoc:
            formData.auctionDoc instanceof File ? formData.auctionDoc : null,
          guidelineDoc:
            formData.guidelineDoc instanceof File
              ? formData.guidelineDoc
              : null,
          deadline: new Date(formData.deadline || ""),
        };

        const response = await rfqService.createRFQ(buyerId, rfqData);
        showNotification("success", "RFQ created successfully!");
        navigate("/rfqs");
        console.log("RFQ created successfully:", response);
      } catch (err: any) {
        showNotification(
          "error",
          err.message || "Failed to create RFQ. Please try again."
        );
        console.error("Error creating RFQ:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileChange =
    (field: "auctionDoc" | "guidelineDoc") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFormData({ ...formData, [field]: e.target.files[0] });
      }
    };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        <MobileHeader showSearchIcon={false} />
        {/* Notification Display */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}

        <div className=" mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
          <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
            Post RFQ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Title" required>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </FormField>

            <FormField label="Project Name" required>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
              />
              {errors.projectName && (
                <p className="text-red-500 text-sm">{errors.projectName}</p>
              )}
            </FormField>

            <FormField label="Purchase Number" required>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={formData.purchaseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseNumber: e.target.value })
                }
              />
              {errors.purchaseNumber && (
                <p className="text-red-500 text-sm">{errors.purchaseNumber}</p>
              )}
            </FormField>

            <FormField label="Category" required>
              <CategorySelect
                width="w-full"
                value={formData.category}
                onChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                excludeAllCategories={true}
              />
            </FormField>

            <FormField label="Quantity" required>
              <input
                type="number"
                className="w-full sm:w-96 p-2 border rounded-md"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: Number(e.target.value) || "",
                  })
                }
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </FormField>

            <FormField label="Auction Document" required>
              <div className="flex flex-col space-y-2">
                <FileUpload onChange={handleFileChange("auctionDoc")} />
                {errors.auctionDoc && (
                  <p className="text-red-500 text-sm">{errors.auctionDoc}</p>
                )}
              </div>
            </FormField>

            <FormField label="Guideline Document" required>
              <div className="flex flex-col space-y-2">
                <FileUpload onChange={handleFileChange("guidelineDoc")} />
                {errors.guidelineDoc && (
                  <p className="text-red-500 text-sm">{errors.guidelineDoc}</p>
                )}
              </div>
            </FormField>

            <FormField label="Deadline" required>
              <input
                type="datetime-local" // Changed from "date" to "datetime-local"
                className="w-full sm:w-96 p-2 border rounded-md"
                value={formData.deadline || ""}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm">{errors.deadline}</p>
              )}
            </FormField>
            <FormField label="Details">
              <textarea
                className="w-full sm:w-96 p-2 border rounded-md h-24"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
              />
            </FormField>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/rfqs")}
                className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back to RFQ List
              </button>
              <button
                className="sm:w-[200px] p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 "
                type="submit"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                    <span className="ml-2">Posting RFQ...</span>
                  </div>
                ) : (
                  "Post RFQ"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRFQ;
