import api from "../config/axios"; // Assuming you have a configured axios instance
import { RFQ } from "../types/rfq";
import { handleApiError } from "../utils/errorHandler";

// Interface for the RFQ data
export interface RFQData {
  productName: string;
  quantity: number;
  category: string;
  detail: string;
  deadline?: Date | null;
  file?: File | null; // Optional file for the RFQ
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
  async getRFQs(buyerId: string) {
    try {
      // Send GET request to fetch RFQs for the buyer
      const response = await api.get(`/rfq/${buyerId}/view-all-rfqs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token in the request headers
        },
      });

      // Sort the RFQs by createdAt, newest first
      const sortedRFQs = response.data.sort(
        (a: RFQ, b: RFQ) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return sortedRFQs; // Return the sorted list of RFQs
    } catch (error: any) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
      throw handleApiError(error); // Handle errors if any
    }
  },

  async getRFQsSeller(sellerId: string) {
    try {
      // Send GET request to fetch RFQs for the buyer
      const response = await api.get(`/rfq/${sellerId}/seller/view-all-rfqs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token in the request headers
        },
      });

      // Sort the RFQs by createdAt, newest first
      const sortedRFQs = response.data.sort(
        (a: RFQ, b: RFQ) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return sortedRFQs; // Return the sorted list of RFQs
    } catch (error: any) {
      console.error(
        "Error occurred:",
        error.response ? error.response.data : error.message
      );
      throw handleApiError(error); // Handle errors if any
    }
  },

  async viewRFQ(rfqId: string) {
    try {
      const response = await api.get(`/rfq/${rfqId}/view-rfq`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const rfqData = response.data;
      console.log(rfqData.file);

      // Map `file` to `fileUrl`, keeping it null if file is null/undefined
      const transformedData: RFQ = {
        ...rfqData,
        fileUrl: rfqData.file ? rfqData.file : null, // Set fileUrl to null if file is null/undefined
      };
      console.log(transformedData);

      // If `fileUrl` exists and is a relative path, prepend the base URL
      if (rfqData.file) {
        const baseUrl = import.meta.env.VITE_BACK_END_URI; // Use .env variable
        if (!baseUrl) {
          console.warn(
            "VITE_BACK_END_URI is not defined in .env; file URL may not work"
          );
          // Avoid throwing error to keep app running; adjust as needed
        } else {
          transformedData.fileUrl = `${baseUrl}${transformedData.fileUrl}`;
        }
      }

      console.log("Transformed fileUrl:", transformedData.fileUrl); // Debug the final URL
      return transformedData; // Return transformed RFQ with `fileUrl`
    } catch (error: any) {
      console.error(
        "Error fetching RFQ:",
        error.response ? error.response.data : error.message
      );
      throw error; // Propagate error to caller (e.g., ViewRFQ component)
    }
  },
  async editRFQ(rfqId: string, rfqData: RFQData) {
    try {
      const formData = new FormData();

      // Append fields from the RFQ data
      if (rfqData.productName !== undefined) {
        formData.append("productName", rfqData.productName);
      }
      if (rfqData.quantity !== undefined) {
        formData.append("quantity", String(rfqData.quantity));
      }
      if (rfqData.category !== undefined) {
        formData.append("category", rfqData.category);
      }
      if (rfqData.detail !== undefined) {
        formData.append("detail", rfqData.detail);
      }
      if (rfqData.deadline) {
        formData.append("deadline", rfqData.deadline.toISOString());
      }

      // Handle file updates
      if (rfqData.file !== undefined) {
        // Check if file is explicitly provided
        if (rfqData.file === null) {
          // Explicitly indicate file removal (could use empty string or special value)
          formData.append("file", ""); // Use empty string to represent null
        } else if (rfqData.file) {
          // If a new file is provided, append it
          formData.append("file", rfqData.file);
        }
        // If file is undefined, don't append anything - keeps existing file
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await api.patch(`/rfq/${rfqId}/edit-rfq`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RFQ updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error updating RFQ:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
  async openRFQ(rfqId: string) {
    try {
      const response = await api.patch(
        `/rfq/${rfqId}/open-rfq`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("RFQ opened successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error opening RFQ:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  async closeRFQ(rfqId: string) {
    try {
      const response = await api.patch(
        `/rfq/${rfqId}/close-rfq`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("RFQ closed successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error closing RFQ:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};
