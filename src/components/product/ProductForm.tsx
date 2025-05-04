import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { Spinner } from "../ui/Spinner";
import SidebarSeller from "../ui/SideBarSeller";
import MobileHeader from "../ui/MobileHeader";
import { productService } from "../../services/product";
import CategorySelect from "../ui/CategorySelect";
import FormField from "../common/FormField";
import SubmitButton from "../common/SubmitButton";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ProductData {
  title: string;
  detail: string;
  category: string;
  image: File | string | null;
}

export const ProductForm: React.FC<{ productId?: string }> = ({
  productId,
}) => {
  const navigate = useNavigate();
  const { id: userId } = useUser();
  const { notification, showNotification, hideNotification } =
    useNotification();
  const [formData, setFormData] = useState<ProductData>({
    title: "",
    detail: "",
    category: "Electronics and Electrical Equipment",
    image: null,
  });
  const [errors, setErrors] = useState<Partial<ProductData>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setIsLoading(true);
        try {
          const product = await productService.viewProduct(productId);
          setFormData({
            title: product.title || "",
            detail: product.detail || "",
            category:
              product.category || "Electronics and Electrical Equipment",
            image: product.image || null,
          });
        } catch (error) {
          showNotification("error", "Failed to load product data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId, showNotification]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductData> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!productId && !formData.image) {
      newErrors.image = "Image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const submitData = {
          title: formData.title,
          detail: formData.detail,
          category: formData.category,
          image: formData.image instanceof File ? formData.image : undefined,
        };

        if (productId) {
          await productService.editProduct(productId, submitData);
          showNotification("success", "Product updated successfully!");
        } else {
          if (userId) {
            await productService.createProduct(userId, submitData);
            showNotification("success", "Product created successfully!");
          } else {
            showNotification("error", "User ID is missing");
          }
        }
        navigate("/products");
      } catch (error) {
        showNotification(
          "error",
          `Failed to ${productId ? "update" : "create"} product`
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const validateImage = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!validTypes.includes(file.type)) {
      showNotification("error", "Only JPG and PNG images are supported");
      return false;
    }
    if (file.size > maxSize) {
      showNotification("error", "Image size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateImage(file)) {
        setFormData({ ...formData, image: file });
        setErrors({ ...errors, image: undefined });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateImage(file)) {
        setFormData({ ...formData, image: file });
        setErrors({ ...errors, image: undefined });
      }
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
  };

  const triggerFileInput = () => {
    console.log("Triggering file input");
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("File input ref is not set");
      showNotification("error", "Failed to open file selector");
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <SidebarSeller />
      <div className="flex-1 flex flex-col w-full relative overflow-y-auto">
        <MobileHeader showSearchIcon={false} />
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
        <div className="mt-10 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full">
          <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
            {productId ? "Edit Product" : "Create Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Title" required>
              <input
                type="text"
                className={`p-2 border rounded-md w-full ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
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
                excludeAllCategories
              />
              {errors.category && (
                <p className="text-red-500 text-sm">{errors.category}</p>
              )}
            </FormField>

            <FormField label="Image" required={!productId}>
              {/* Image Preview */}
              {/* Image Preview */}
              {formData.image && (
                <div className="mb-4 relative group">
                  <div className="w-64 h-64 rounded-md overflow-hidden border border-gray-200">
                    {typeof formData.image === "string" ? (
                      <img
                        src={formData.image}
                        alt="Current product"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white rounded-full p-1 opacity-75 hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="bg-primary-color text-white rounded-full p-1 opacity-75 hover:opacity-100 transition-opacity"
                      title="Change Image"
                    >
                      <FiImage className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              {/* Upload Area */}
              {!formData.image && (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-primary-color bg-primary-color/10"
                      : "border-gray-300 hover:border-primary-color"
                  } ${errors.image ? "border-red-500" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FiUpload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {isDragging
                        ? "Drop the image here"
                        : "Drag & drop an image here, or click to select"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports JPG, PNG (Max 5MB)
                    </p>
                  </div>
                </div>
              )}

              {/* File Input (Always Rendered) */}
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {errors.image && (
                <p className="text-red-500 text-sm">
                  {typeof errors.image === "string" ? errors.image : ""}
                </p>
              )}
            </FormField>

            <FormField label="Detail">
              <textarea
                className={`p-2 border rounded-md w-full h-24 ${
                  errors.detail ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.detail}
                onChange={(e) =>
                  setFormData({ ...formData, detail: e.target.value })
                }
              />
              {errors.detail && (
                <p className="text-red-500 text-sm">{errors.detail}</p>
              )}
            </FormField>

            <SubmitButton
              isLoading={isLoading}
              text={productId ? "Update Product" : "Create Product"}
              loadingText={
                productId ? "Updating Product..." : "Creating Product..."
              }
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
