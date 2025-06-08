import React, { useEffect, useRef, useState } from "react";
import FormField from "../common/FormField";
import FileUploadZip from "../common/FileUploadZip";
import SidebarSeller from "../ui/SideBarSeller";
import { bidService } from "../../services/bid"; // Adjust path
import { useUser } from "../../context/UserContext"; // Adjust path
import MobileHeader from "../ui/MobileHeader";
import { Spinner } from "../ui/Spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotification } from "../../hooks/useNotification"; // Adjust path
import { Notification } from "../ui/Notification"; // Adjust path
import { Bid, BidItem } from "../../types/bid";
import Select from "react-select/base";
import { SingleValue } from "react-select";
import { ChevronDown } from "lucide-react";
import { formatNumberWithCommas } from "../../utils/formatter";

const BidComponent: React.FC = () => {
  const { id: userId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const { purchaseNumber, rfqId } = location.state || {
    purchaseNumber: "Unknown purchaseNumber",
    rfqId: "",
  };
  console.log("RFQ ID from location state:", rfqId);

  const [formData, setFormData] = useState<Bid>({
    rfqId: rfqId || "", // Pre-fill from location state if available
    rfq: {
      id: "",
      title: "",
      quantity: "",
      category: "All Categories",
      projectName: "",
      purchaseNumber: "",
      detail: "",
      deadline: new Date().toISOString(), // Example default value
    }, // Add default rfq object
    state: "", // Add default state value
    totalPrice: 0,
    bidItems: [],
    files: null,
  });

  const [errors, setErrors] = useState({
    bidFiles: "",
    bidItems: "",
  });

  const { notification, showNotification, hideNotification } =
    useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const units = [
    "pcs", // pieces
    "kg", // kilograms
    "m", // meters
    "pack", // packs
    "box", // boxes
    "pair", // pairs
  ];

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.files) newErrors.bidFiles = "Zip file is required";
    if (formData.bidItems.length === 0)
      newErrors.bidItems = "At least one item is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "application/zip" || file.name.endsWith(".zip"))
    ) {
      setFormData({ ...formData, files: file });
      setErrors({ ...errors, bidFiles: "" });
    } else {
      setErrors({ ...errors, bidFiles: "Please attach Zip file" });
      setFormData({ ...formData, files: null });
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
    setShowModal(true);
  };

  const removeItem = () => {
    if (itemToRemove !== null) {
      const updatedItems: BidItem[] = formData.bidItems.filter(
        (_: BidItem, i: number) => i !== itemToRemove
      );
      setFormData({ ...formData, bidItems: updatedItems });
      setShowModal(false);
      setItemToRemove(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToRemove(null);
  };

  const updateItem = <K extends keyof BidItem>(
    index: number,
    field: K,
    value: BidItem[K]
  ) => {
    const updatedItems = formData.bidItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : { ...item }
    );

    // Recalculate totalPrice for the updated item
    const item = updatedItems[index];
    item.totalPrice =
      (Number(item.singlePrice) || 0) * (Number(item.quantity) || 0) +
      (Number(item.transportFee) || 0) +
      (Number(item.taxes) || 0);

    console.log(`Updating item ${index}, ${field} to:`, value); // Debug
    console.log("New updatedItems:", updatedItems);

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        bidItems: updatedItems,
        totalPrice: calculateTotalBid(updatedItems),
      };
      console.log("New formData:", newFormData); // Debug
      return newFormData;
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
    if (validateForm()) {
      setIsLoading(true);
      try {
        if (!userId) {
          showNotification("error", "User not logged in or invalid user ID");
          console.error("User not logged in or invalid user ID");
          return;
        }

        const bidData = {
          rfqId: formData.rfqId || "", // Ensure rfqId is always a string
          totalPrice: Number(calculateTotalBid()), // Ensure totalPrice is a number
          bidItems: formData.bidItems.map((item) => ({
            ...item,
            quantity: Number(item.quantity), // Ensure quantity is a number
            singlePrice: Number(item.singlePrice), // Ensure singlePrice is a number
            transportFee: Number(item.transportFee || 0), // Ensure transportFee is a number
            taxes: Number(item.taxes || 0), // Ensure taxes is a number
            totalPrice: Number(item.totalPrice), // Ensure totalPrice is a number
          })),
          bidFiles: formData.files instanceof File ? formData.files : null, // Adjusted to match BidData type
        };
        console.log("Submitting bid with data:", bidData); // Debug

        const response = await bidService.createBid(userId, bidData);
        console.log("Bid response:", response);
        showNotification("success", "Bid submitted successfully!");
        navigate("/bids");
        console.log("Bid submitted successfully:", response);
      } catch (err: any) {
        showNotification(
          "error",
          err.message || "Failed to submit bid. Please try again."
        );
        console.error("Error submitting bid:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-transparent w-full overflow-x-hidden">
      <SidebarSeller />

      <div className="flex-1 flex flex-col w-full ">
        <MobileHeader showSearchIcon={false} />

        {/* Notification Display */}
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
              Bid for {purchaseNumber}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField label="Bid Documents" required>
                <div className="flex flex-col space-y-2">
                  <FileUploadZip onChange={handleFileChange} />
                  {errors.bidFiles && (
                    <p className="text-red-500 text-sm">{errors.bidFiles}</p>
                  )}
                </div>
              </FormField>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Items</h3>
                  <p className="text-primary-color font-semibold">
                    Total Bid: ETB:{" "}
                    {formatNumberWithCommas(Number(calculateTotalBid()))}
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
                      {formData.bidItems.map((item: BidItem, index: number) => (
                        <tr key={index}>
                          <td className="p-2 border">
                            <input
                              type="text"
                              className="w-full p-1 border rounded"
                              value={item.item}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => updateItem(index, "item", e.target.value)}
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
                                updateItem(index, "quantity", e.target.value)
                              }
                              required
                            />
                          </td>

                          <td className="p-2 border min-w-[150px] relative">
                            <select
                              className="w-full p-1 pr-6 border rounded appearance-none bg-white cursor-pointer
               focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={item.unit}
                              onChange={(e) =>
                                updateItem(index, "unit", e.target.value)
                              }
                              size={1}
                              onBlur={(e) => {
                                (e.target as HTMLSelectElement).size = 1;
                                (e.target as HTMLSelectElement).style.height =
                                  "";
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
                            {/* Custom dropdown arrow */}
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
                                updateItem(index, "singlePrice", e.target.value)
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
                              ) => updateItem(index, "taxes", e.target.value)}
                            />
                          </td>
                          <td className="p-2 border">
                            ETB:{" "}
                            {formatNumberWithCommas(Number(item.totalPrice))}
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
                      ))}
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
                className="max-w-64 p-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                type="submit"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                    <span className="ml-2">Submitting Bid...</span>
                  </div>
                ) : (
                  "Bid Now"
                )}
              </button>
            </form>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                  <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidComponent;
