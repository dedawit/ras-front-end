import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { RFQData, rfqService } from "../../services/rfq";
import { RFQ } from "../../types/rfq";
import FormField from "../common/FormField";
import FileUpload from "../common/FileUpload";
import CategorySelect from "../ui/CategorySelect";
import { useUser } from "../../context/UserContext";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";

const EditRFQ: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [formData, setFormData] = useState<Partial<RFQ>>({});
  const [errors, setErrors] = useState({
    productName: "",
    quantity: "",
    deadline: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showExpiryDate, setShowExpiryDate] = useState(false);
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    const fetchRFQ = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const rfqData = await rfqService.viewRFQ(id);
          setRfq(rfqData);
          setFormData(rfqData);
          setShowExpiryDate(!!rfqData.deadline);
        } else {
          throw new Error("Invalid RFQ ID");
        }
      } catch (error) {
        setErrors((prev) => ({ ...prev, general: "Error fetching RFQ data" }));
        showNotification("error", "Failed to load RFQ data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRFQ();
  }, [id, showNotification]);

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.productName)
      newErrors.productName = "Product name is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (showExpiryDate && !formData.deadline)
      newErrors.deadline = "Deadline is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (validateForm()) {
      setIsLoading(true);
      try {
        const updatedData = {
          quantity: Number(formData.quantity),
          deadline: showExpiryDate ? new Date(formData.deadline!) : null,
          productName: formData.productName || "",
          category: formData.category || "",
          detail: formData.detail || "",
          file: formData.file || null,
        };

        await rfqService.editRFQ(id, updatedData);
        showNotification("success", "RFQ updated successfully!");
      } catch (error) {
        console.error("Error updating RFQ:", error);
        setErrors((prev) => ({ ...prev, general: "Error updating RFQ" }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStateToggle = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      if (formData.state) {
        await rfqService.closeRFQ(id);
        showNotification("success", "RFQ closed successfully!");
        setFormData({ ...formData, state: false });
        setRfq({ ...rfq!, state: false });
      } else {
        await rfqService.openRFQ(id);
        showNotification("success", "RFQ opened successfully!");
        setFormData({ ...formData, state: true });
        setRfq({ ...rfq!, state: true });
      }
    } catch (error: any) {
      console.error("Error toggling RFQ state:", error);
      setErrors((prev) => ({ ...prev, general: "Error updating RFQ state" }));
      showNotification("error", error.message || "Failed to update RFQ state");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <MobileHeader showSearchIcon={false} />
        {/* Notification Display */}
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
        <div className="mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
          <h2 className="text-2xl font-semibold text-center text-primary-color mb-4">
            Edit RFQ
          </h2>
          {/* State Toggle Button Below Title */}
          {formData.state !== undefined && (
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={handleStateToggle}
                disabled={isLoading}
                className={` inline-block px-4 py-2 text-white font-bold border rounded-md w-full ${
                  formData.state
                    ? "bg-red-600 hover:bg-red-700 "
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? (
                  <Spinner />
                ) : formData.state ? (
                  "Close RFQ"
                ) : (
                  "Open RFQ"
                )}
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Product Name" required>
              <input
                type="text"
                className="p-2 border rounded-md w-full sm:w-96"
                value={formData.productName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
              />
              {errors.productName && (
                <p className="text-red-500 text-sm">{errors.productName}</p>
              )}
            </FormField>

            <FormField label="Category" required>
              <CategorySelect
                width="w-full"
                value={formData.category || ""}
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
                value={formData.quantity || ""}
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

            <FormField label="Details">
              <textarea
                className="w-full sm:w-96 p-2 border rounded-md h-24"
                value={formData.detail || ""}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
              />
            </FormField>

            <FormField label="File :  (Max size: 10MB, types: jpg, jpeg, png, pdf, docx, doc, xlsx, xls)">
              <FileUpload
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    file: e.target.files?.[0] || null,
                  })
                }
                existingFile={formData.fileUrl}
              />
            </FormField>

            <FormField label=" ">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="set-expiry-date"
                  checked={showExpiryDate}
                  onChange={(e) => setShowExpiryDate(e.target.checked)}
                />
                <label htmlFor="set-expiry-date" className="text-sm">
                  Set Deadline
                </label>
              </div>
            </FormField>

            {showExpiryDate && (
              <FormField label="Deadline" required>
                <input
                  type="date"
                  className="w-full sm:w-96 p-2 border rounded-md"
                  value={
                    formData.deadline
                      ? new Date(formData.deadline).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                />
                {errors.deadline && (
                  <p className="text-red-500 text-sm">{errors.deadline}</p>
                )}
              </FormField>
            )}

            <button
              className="w-full p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 mt-6"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Update RFQ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRFQ;
