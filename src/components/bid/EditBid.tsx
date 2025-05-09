import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarSeller from "../ui/SideBarSeller"; // Adjust path as needed
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { bidService } from "../../services/bid"; // Adjust path
import { Bid, BidItem } from "../../types/bid"; // Adjust path
import FileUploadZip from "../common/FileUploadZip";
import { useNotification } from "../../hooks/useNotification";
import { Notification } from "../ui/Notification";
import { FaTrash } from "react-icons/fa";
import { ChevronDown } from "lucide-react";
import FormField from "../common/FormField";

const EditBid: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get bidId from URL
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } =
    useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false); // State for remove confirmation
  const [itemToRemove, setItemToRemove] = useState<number | null>(null); // Store index of item to remove
  const [bid, setBid] = useState<Bid | null>(null);
  const [formData, setFormData] = useState<Bid>({
    id: "",
    rfqId: "",
    rfq: {
      id: "",
      title: "",
      quantity: "",
      category: "All Categories",
      projectName: "",
      purchaseNumber: "",
      detail: "",
      deadline: new Date().toISOString(),
    },
    state: "",
    totalPrice: 0,
    bidItems: [],
    files: null,
  });
  const [errors, setErrors] = useState({
    bidFiles: "",
    bidItems: "",
  });

  const units = ["pcs", "kg", "m", "pack", "box", "pair"];

  // Fetch bid data when component mounts
  useEffect(() => {
    const fetchBid = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const bidData = await bidService.viewBid(id); // Fetch existing bid
          setBid(bidData);
          setFormData({
            ...bidData,
            files: bidData.files || null, // String URL or null from backend
          });
        } else {
          throw new Error("Invalid Bid ID");
        }
      } catch (error) {
        showNotification("error", "Failed to load bid data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBid();
  }, [id, showNotification]);

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.files && !bid?.files) {
      newErrors.bidFiles = "Zip file is required";
    }
    if (formData.bidItems.length === 0) {
      newErrors.bidItems = "At least one item is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, files: file });
    if (file) {
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        setErrors({ ...errors, bidFiles: "" });
      } else {
        setErrors({ ...errors, bidFiles: "Please attach a valid ZIP file" });
      }
    } else {
      setErrors({
        ...errors,
        bidFiles: bid?.files ? "" : "Zip file is required",
      });
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      bidItems: [
        ...formData.bidItems,
        {
          item: "",
          quantity: 0,
          unit: units[0],
          singlePrice: 0,
          transportFee: 0,
          taxes: 0,
          totalPrice: 0,
        },
      ],
    });
  };

  const confirmRemoveItem = (index: number) => {
    setItemToRemove(index);
    setShowRemoveConfirm(true);
  };

  const removeItem = () => {
    if (itemToRemove !== null) {
      const updatedItems = formData.bidItems.filter(
        (_, i) => i !== itemToRemove
      );
      setFormData({
        ...formData,
        bidItems: updatedItems,
        totalPrice: calculateTotalBid(updatedItems),
      });
      setShowRemoveConfirm(false);
      setItemToRemove(null);
    }
  };

  const closeModal = () => {
    setShowRemoveConfirm(false);
    setItemToRemove(null);
  };

  const updateItem = <K extends keyof BidItem>(
    index: number,
    field: K,
    value: BidItem[K]
  ) => {
    const updatedItems = formData.bidItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );

    // Recalculate totalPrice for the updated item
    const item = updatedItems[index];
    item.totalPrice =
      (Number(item.singlePrice) || 0) * (Number(item.quantity) || 0) +
      (Number(item.transportFee) || 0) +
      (Number(item.taxes) || 0);

    setFormData({
      ...formData,
      bidItems: updatedItems,
      totalPrice: calculateTotalBid(updatedItems),
    });
  };

  const handleFocus = (index: number, field: keyof BidItem, value: number) => {
    if (value === 0) {
      const updatedItems = [...formData.bidItems];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: "" as any, // Temporarily set to empty string for input
      };
      setFormData({ ...formData, bidItems: updatedItems });
    }
  };

  const calculateTotalBid = (items: BidItem[] = formData.bidItems) => {
    return items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (validateForm()) {
      setIsLoading(true);
      try {
        const bidData = {
          id: id,
          totalPrice: Number(formData.totalPrice),
          bidItems: formData.bidItems.map((item) => ({
            item: String(item.item),
            quantity: Number(item.quantity),
            unit: String(item.unit),
            singlePrice: Number(item.singlePrice),
            transportFee: item.transportFee ? Number(item.transportFee) : 0,
            taxes: item.taxes ? Number(item.taxes) : 0,
            totalPrice: Number(item.totalPrice),
          })),
          bidFiles: formData.files, // File | null
        };

        await bidService.editBid(id, {
          ...bidData,
          bidFiles: formData.files instanceof File ? formData.files : null,
        });
        showNotification("success", "Bid updated successfully!");
        // navigate("/bids");
      } catch (error: any) {
        showNotification("error", error.message || "Failed to update bid");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      await bidService.deleteBid(id);
      showNotification("success", "Bid deleted successfully!");
      navigate("/bids");
    } catch (error: any) {
      showNotification("error", error.message || "Failed to delete bid");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <div className="fixed top-0 left-0 h-full w-64 hidden md:block">
        <SidebarSeller />
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

        <div className="mt-4 sm:mt-24 md:max-w-4xl lg:max-w-5xl mx-auto p-6 bg-transparent rounded-3xl shadow-lg max-w-full relative">
          {isLoading && !bid ? (
            <div className="flex justify-center items-center h-full">
              <Spinner className="h-16 w-16 border-4" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-center text-primary-color mb-6">
                Edit Bid for {formData.rfq.purchaseNumber || "Unknown"}
              </h2>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                disabled={isLoading}
                title="Delete Bid"
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
                      Are you sure you want to delete this bid?
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

              {showRemoveConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h3 className="text-lg font-semibold mb-4">
                      Are you sure?
                    </h3>
                    <p className="mb-6">
                      Do you really want to remove this item? This action cannot
                      be undone.
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={removeItem}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Bid Documents" required>
                  <div className="flex flex-col space-y-2">
                    <FileUploadZip
                      onChange={handleFileChange}
                      existingFile={bid?.files || null}
                    />
                    {errors.bidFiles && (
                      <p className="text-red-500 text-sm">{errors.bidFiles}</p>
                    )}
                  </div>
                </FormField>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Items</h3>
                    <p className="text-primary-color font-semibold">
                      Total Bid: ETB: {calculateTotalBid()}
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
                          <th className="p-2 border">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.bidItems.map(
                          (item: BidItem, index: number) => (
                            <tr key={index}>
                              <td className="p-2 border">
                                <input
                                  type="text"
                                  className="w-full p-1 border rounded"
                                  value={item.item}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateItem(index, "item", e.target.value)
                                  }
                                  required
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded"
                                  value={item.quantity}
                                  onFocus={() =>
                                    handleFocus(
                                      index,
                                      "quantity",
                                      Number(item.quantity)
                                    )
                                  }
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateItem(
                                      index,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </td>
                              <td className="p-2 border min-w-[150px] relative">
                                <select
                                  className="w-full p-1 pr-6 border rounded appearance-none bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  value={item.unit}
                                  onChange={(e) =>
                                    updateItem(index, "unit", e.target.value)
                                  }
                                  size={1}
                                  onBlur={(e) => {
                                    (e.target as HTMLSelectElement).size = 1;
                                    (
                                      e.target as HTMLSelectElement
                                    ).style.height = "";
                                  }}
                                >
                                  {units.map((unit) => (
                                    <option
                                      key={unit}
                                      value={unit}
                                      className="p-1 hover:bg-gray-100"
                                    >
                                      {unit}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                </div>
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded"
                                  value={item.singlePrice}
                                  onFocus={() =>
                                    handleFocus(
                                      index,
                                      "singlePrice",
                                      Number(item.singlePrice)
                                    )
                                  }
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateItem(
                                      index,
                                      "singlePrice",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded"
                                  value={item.transportFee || ""}
                                  onFocus={() =>
                                    handleFocus(
                                      index,
                                      "transportFee",
                                      Number(item.transportFee || 0)
                                    )
                                  }
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateItem(
                                      index,
                                      "transportFee",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className="p-2 border">
                                <input
                                  type="number"
                                  className="w-full p-1 border rounded"
                                  value={item.taxes || ""}
                                  onFocus={() =>
                                    handleFocus(
                                      index,
                                      "taxes",
                                      Number(item.taxes || 0)
                                    )
                                  }
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    updateItem(index, "taxes", e.target.value)
                                  }
                                />
                              </td>
                              <td className="p-2 border">
                                ETB:{item.totalPrice}
                              </td>
                              <td className="p-2 border">
                                <button
                                  type="button"
                                  onClick={() => confirmRemoveItem(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  {errors.bidItems && (
                    <p className="text-red-500 text-sm">{errors.bidItems}</p>
                  )}

                  <button
                    type="button"
                    onClick={addItem}
                    className="max-w-64 p-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    Add Item
                  </button>
                </div>

                <button
                  className="max-w-64 p-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 mt-6"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <Spinner />
                      <span className="ml-2">Updating Bid...</span>
                    </div>
                  ) : (
                    "Update Bid"
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

export default EditBid;
