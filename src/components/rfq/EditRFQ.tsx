import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../ui/SideBar";
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { rfqService } from "../../services/rfq";
import { RFQ } from "../../types/rfq";
import FormField from "../common/FormField";
import FileUpload from "../common/FileUpload";
import CategorySelect from "../ui/CategorySelect";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { FaTrash } from "react-icons/fa";

const EditRFQ: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [formData, setFormData] = useState<Partial<RFQ>>({
    title: "",
    projectName: "",
    purchaseNumber: "",
    category: "Electronics and Electrical Equipment",
    quantity: "",
    detail: "",
    auctionDoc: null,
    guidelineDoc: null,
    deadline: "",
    state: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    projectName: "",
    purchaseNumber: "",
    quantity: "",
    auctionDoc: "",
    guidelineDoc: "",
    deadline: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
          const deadline = rfqData.deadline
            ? new Date(rfqData.deadline).toISOString().slice(0, 16)
            : "";
          setFormData({
            title: rfqData.title || "",
            projectName: rfqData.projectName || "",
            purchaseNumber: rfqData.purchaseNumber || "",
            category:
              rfqData.category || "Electronics and Electrical Equipment",
            quantity: rfqData.quantity || "",
            detail: rfqData.detail || "",
            auctionDoc: rfqData.auctionDoc || null, // String URL from backend
            guidelineDoc: rfqData.guidelineDoc || null, // String URL from backend
            deadline,
            state: rfqData.state || "",
          });
        } else {
          throw new Error("Invalid RFQ ID");
        }
      } catch (error) {
        showNotification("error", "Failed to load RFQ data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRFQ();
  }, [id, showNotification]);

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
    if (!id) return;

    if (validateForm()) {
      setIsLoading(true);
      try {
        const updatedData = {
          title: formData.title || "",
          projectName: formData.projectName || "",
          purchaseNumber: formData.purchaseNumber || "",
          category: formData.category || "",
          quantity: Number(formData.quantity),
          detail: formData.detail || "",
          auctionDoc:
            formData.auctionDoc instanceof File ? formData.auctionDoc : null, // Ensure File or null
          guidelineDoc:
            formData.guidelineDoc instanceof File
              ? formData.guidelineDoc
              : null, // Ensure File or null
          deadline: new Date(formData.deadline || ""),
        };

        await rfqService.editRFQ(id, updatedData);
        showNotification("success", "RFQ updated successfully!");
        // navigate("/rfqs");
      } catch (error: any) {
        showNotification("error", error.message || "Failed to update RFQ");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await rfqService.deleteRFQ(id);
      showNotification("success", "RFQ deleted successfully!");
      navigate("/rfqs");
    } catch (error: any) {
      showNotification("error", error.message || "Failed to delete RFQ");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleFileChange =
    (field: "auctionDoc" | "guidelineDoc") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      setFormData((prev) => ({
        ...prev,
        [field]: file, // Set to File or null (removing file sets it to null)
      }));
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

        <div className="mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full relative">
          {isLoading && !rfq ? (
            <div className="flex justify-center items-center h-full">
              <Spinner className="h-16 w-16 border-4" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
                Edit RFQ
              </h2>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                disabled={isLoading}
                title="Delete RFQ"
              >
                <FaTrash size={20} />
              </button>

              {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Confirm Deletion
                    </h3>
                    <p className="mb-4">
                      Are you sure you want to delete this RFQ?
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={isLoading}
                      >
                        {isLoading ? <Spinner /> : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Title" required>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full sm:w-96"
                    value={formData.title || ""}
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
                    value={formData.projectName || ""}
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
                    value={formData.purchaseNumber || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        purchaseNumber: e.target.value,
                      })
                    }
                  />
                  {errors.purchaseNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.purchaseNumber}
                    </p>
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

                <FormField label="Auction Document" required>
                  <div className="flex flex-col space-y-2">
                    <FileUpload
                      onChange={handleFileChange("auctionDoc")}
                      existingFile={formData.auctionDoc} // String or File
                    />
                    {errors.auctionDoc && (
                      <p className="text-red-500 text-sm">
                        {errors.auctionDoc}
                      </p>
                    )}
                  </div>
                </FormField>

                <FormField label="Guideline Document" required>
                  <div className="flex flex-col space-y-2">
                    <FileUpload
                      onChange={handleFileChange("guidelineDoc")}
                      existingFile={formData.guidelineDoc} // String or File
                    />
                    {errors.guidelineDoc && (
                      <p className="text-red-500 text-sm">
                        {errors.guidelineDoc}
                      </p>
                    )}
                  </div>
                </FormField>

                <FormField label="Deadline" required>
                  <input
                    type="datetime-local"
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
                    value={formData.detail || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, detail: e.target.value })
                    }
                  />
                </FormField>

                <button
                  className="w-full p-3 bg-primary-color text-white rounded-md hover:bg-blue-700 mt-6"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Spinner />
                      <span className="ml-2">Updating RFQ...</span>
                    </div>
                  ) : (
                    "Update RFQ"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditRFQ;
