import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { FiUpload, FiX, FiImage, FiTrash2 } from "react-icons/fi";

interface ProductData {
  title: string;
  detail: string;
  category: string;
  image: File | string | null;
}

const EditProductCard: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
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
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
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
            image:
              product.imageUri && typeof product.imageUri === "string"
                ? product.imageUri
                : null,
          });
          console.log(product.imageUri);
        } catch (error) {
          console.error("Error fetching product:", error);
          showNotification("error", "Failed to load product data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    } else {
      showNotification("error", "Product ID is missing");
      navigate("/products");
    }
  }, [productId, showNotification, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductData> = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      showNotification("error", "Product ID is missing");
      return;
    }
    if (validateForm()) {
      setIsLoading(true);
      try {
        const submitData = {
          title: formData.title,
          detail: formData.detail,
          category: formData.category,
          image: formData.image instanceof File ? formData.image : undefined,
        };

        await productService.editProduct(productId, submitData);
        showNotification("success", "Product updated successfully!");
        navigate("/products");
      } catch (error) {
        console.error("Error updating product:", error);
        showNotification("error", "Failed to update product");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!productId) {
      showNotification("error", "Product ID is missing");
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productId) {
      showNotification("error", "Product ID is missing");
      return;
    }
    setIsLoading(true);
    try {
      await productService.deleteProduct(productId);
      showNotification("success", "Product deleted successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification("error", "Failed to delete product");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      showNotification("error", "Failed to open file selector");
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden relative">
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
        <div className="mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-white rounded-3xl shadow-lg max-w-full relative">
          {/* Delete Icon */}
          <button
            onClick={handleDelete}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-75 hover:opacity-100 transition-opacity"
            title="Delete Product"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this product? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
            Edit Product
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

            <FormField label="Image" required>
              {formData.image && (
                <div className="mb-4 relative group">
                  <div className="w-64 h-64 rounded-md overflow-hidden border border-gray-200">
                    {typeof formData.image === "string" && formData.image ? (
                      <img
                        src={formData.image}
                        alt="Current product"
                        className="w-full h-full object-cover"
                        onError={() => {
                          console.error(
                            "Failed to load image:",
                            formData.image
                          );
                          setFormData({ ...formData, image: null });
                        }}
                      />
                    ) : formData.image instanceof File ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  {(typeof formData.image === "string" ||
                    formData.image instanceof File) && (
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
                  )}
                </div>
              )}
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
              text="Update Product"
              loadingText="Updating Product..."
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProductCard;
