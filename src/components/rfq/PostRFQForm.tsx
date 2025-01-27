import React, { useState } from "react";
import FormField from "../common/FormField";
import FileUpload from "../common/FileUpload";
import CategorySelect from "../ui/CategorySelect";
import SubmitButton from "../common/SubmitButton";
import { RFQ } from "../../types/rfq";
import Sidebar from "../ui/SideBar";
import { rfqService } from "../../services/rfq"; // Import the RFQ service
import { useUser } from "./../../context/UserContext"; // Import the UserContext
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner"; // Import the Spinner component
import { useNavigate } from "react-router-dom";

const PostRFQ: React.FC = () => {
  const { id: userId } = useUser(); // Get user info from the context
  const [formData, setFormData] = useState<RFQ>({
    id: "",
    productName: "",
    category: "Electronics and Electrical Equipment",
    quantity: "",
    detail: "",
    file: null,
    expiryDate: "",
  });

  const [errors, setErrors] = useState({
    productName: "",
    quantity: "",
    expiryDate: "", // Add expiryDate error
  });

  const [showExpiryDate, setShowExpiryDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.productName)
      newErrors.productName = "Product name is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";

    // Add validation for expiryDate if Set Expiry Date is checked
    if (showExpiryDate && !formData.expiryDate) {
      newErrors.expiryDate =
        "Expiry date is required when Set Expiry Date is selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true); // Start loading
      try {
        // Ensure the user is logged in and has a buyerId
        if (!userId) {
          console.error("User not logged in or invalid user ID");
          return;
        }

        // Get buyerId from user context
        const buyerId = userId;

        // Prepare the RFQ data
        const rfqData = {
          productName: formData.productName,
          quantity: Number(formData.quantity),
          category: formData.category,
          detail: formData.detail,
          deadline: formData.expiryDate
            ? new Date(formData.expiryDate)
            : undefined,
          file: formData.file,
        };

        // Call the service to create the RFQ
        const response = await rfqService.createRFQ(buyerId, rfqData);
        navigate("/rfqs"); // Redirect to RFQ list after successful post

        console.log("RFQ created successfully:", response);

        // Handle success (e.g., show success notification or redirect)
      } catch (err: any) {
        console.error("Error creating RFQ:", err);
        // Handle error (e.g., show error notification)
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <MobileHeader showSearchIcon={false} />

        <div className="mt-8 sm:mt-24  md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
          <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
            Post RFQ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Name Field */}
            <FormField label="Product Name" required>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
              />
              {errors.productName && (
                <p className="text-red-500 text-sm">{errors.productName}</p>
              )}
            </FormField>

            {/* Category Field */}
            <FormField label="Category" required>
              <CategorySelect
                width="w-full"
                value={formData.category}
                onChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                excludeAllCategories={true} // Hide "All Categories"
              />
            </FormField>

            {/* Quantity Field */}
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

            {/* Details Field */}
            <FormField label="Details">
              <textarea
                className="w-full sm:w-96 p-2 border rounded-md h-24"
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
              />
            </FormField>

            {/* File Upload Field */}
            <FormField label="File :  (Max size: 10MB, types: jpg, jpeg, png, pdf, docx, doc, xlsx, xls)">
              <FileUpload onChange={handleFileChange} />
            </FormField>

            {/* Expiry Date Checkbox */}
            <FormField label=" ">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="set-expiry-date"
                  className="mr-2"
                  checked={showExpiryDate}
                  onChange={(e) => setShowExpiryDate(e.target.checked)}
                />
                <label htmlFor="set-expiry-date" className="text-sm">
                  Set Expiry Date
                </label>
              </div>
            </FormField>

            {/* Expiry Date Input (Visible when checked) */}
            {showExpiryDate && (
              <FormField label="Expiry Date" required>
                <input
                  type="date"
                  className="w-full sm:w-96 p-2 border rounded-md"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm">{errors.expiryDate}</p>
                )}
              </FormField>
            )}

            {/* Submit Button with Spinner */}
            <button
              className="w-full p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 mt-6"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRFQ;
