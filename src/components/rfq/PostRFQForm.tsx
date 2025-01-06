import React, { useState } from "react";
import FormField from "../common/FormField";
import FileUpload from "../common/FileUpload";
import CategorySelect from "../ui/CategorySelect";
import SubmitButton from "../common/SubmitButton";
import { RFQ } from "../../types/rfq";
import Sidebar from "../ui/SideBar";

const PostRFQ: React.FC = () => {
  const [formData, setFormData] = useState<RFQ>({
    id: "",
    title: "",
    category: "Electronics and Electrical Equipment",
    quantity: "",
    details: "",
    file: null,
    expiryDate: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    quantity: "",
    expiryDate: "", // Add expiryDate error
  });

  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.title) newErrors.title = "Product name is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";

    // Add validation for expiryDate if Set Expiry Date is checked
    if (showExpiryDate && !formData.expiryDate) {
      newErrors.expiryDate =
        "Expiry date is required when Set Expiry Date is selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (validateForm()) {
      console.log("Form submitted:", formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  return (
    <div className="flex h-screen bg-transparent">
      <Sidebar />
      <div className="flex-1 flex flex-col mt-24">
        <div className="max-w-2xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
            Post RFQ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Product Name" required>
              <input
                type="text"
                className="p-2 border rounded-md w-96"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </FormField>

            <FormField label="Category" required>
              <CategorySelect
                value={formData.category}
                onChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                excludeAllCategories={true} // Hide "All Categories"
              />
            </FormField>

            <FormField label="Quantity" required>
              <input
                type="number"
                className="w-96 p-2 border rounded-md"
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

            <FormField label="Details">
              <textarea
                className="w-96 p-2 border rounded-md h-24"
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
              />
            </FormField>

            <FormField label="File">
              <FileUpload onChange={handleFileChange} />
            </FormField>

            <FormField label=" ">
              {/* Set Expiry Date Checkbox aligned horizontally with input field */}
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

            {/* Expiry Date Input aligned horizontally */}
            {showExpiryDate && (
              <FormField label="Expiry Date" required>
                <input
                  type="date"
                  className="w-96 p-2 border rounded-md"
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

            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostRFQ;
