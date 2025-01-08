import api from "../config/axios"; // Assuming you have a configured axios instance
import { handleApiError } from "../utils/errorHandler";

// Interface for the RFQ data
export interface RFQData {
  productName: string;
  quantity: number;
  category: string;
  detail: string;
  deadline?: Date;
  file?: File; // Optional file for the RFQ
}

// Service to create an RFQ
export const rfqService = {
  async createRFQ(buyerId: string, rfqData: RFQData) {
    try {
      const formData = new FormData();

      // Append fields from the RFQ data
      formData.append("productName", rfqData.productName);
      formData.append("quantity", String(rfqData.quantity));
      formData.append("category", rfqData.category);
      formData.append("detail", rfqData.detail);

      // Send deadline as ISO string
      if (rfqData.deadline) {
        formData.append("deadline", rfqData.deadline.toISOString()); // Use toISOString() for standard format
      }

      if (rfqData.file) {
        formData.append("file", rfqData.file);
      }

      // Get the token from localStorage (or wherever you store the JWT)
      const token = localStorage.getItem("token"); // Replace with your method of storing the token
      // If no token found, throw an error
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Send the POST request to the backend
      const response = await api.post(
        `/rfq/buyer/${buyerId}/create-rfq`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
            Authorization: `Bearer ${"abcd"}`, // Add the token in the Authorization header
          },
        }
      );

      return response.data; // Return the response data after successful creation
    } catch (error: any) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
      throw handleApiError(error); // Handle errors if any
    }
  },
  // Get RFQs method
  async getRFQs(buyerId: string) {
    try {
      // Send GET request to fetch RFQs for the buyer
      const response = await api.get(`/rfq/${buyerId}/view-all-rfqs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token in the request headers
        },
      });

      return response.data; // Return the list of RFQs
    } catch (error: any) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
      throw handleApiError(error); // Handle errors if any
    }
  },
};
