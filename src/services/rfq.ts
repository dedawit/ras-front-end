import api from "../config/axios";
import { RFQ } from "../types/rfq";
import { handleApiError } from "../utils/errorHandler";

// Interface for RFQ data
export interface RFQData {
  title: string;
  projectName: string;
  purchaseNumber: string;
  quantity: number;
  category: string;
  detail?: string;
  auctionDoc?: File | null;
  guidelineDoc?: File | null;
  deadline: Date;
}

export const rfqService = {
  /**
   * Fetches a generated purchase number for a specific buyer
   */
  async getGeneratedPurchaseNumber(buyerId: string): Promise<string> {
    try {
      console.log(buyerId, "test");
      const response = await api.get(
        `/rfq/${buyerId}/generate-purchase-number`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data.purchaseNumber;
    } catch (error) {
      console.error("Error fetching generated purchase number:", error);
      throw handleApiError(error);
    }
  },

  async createRFQ(buyerId: string, rfqData: RFQData) {
    try {
      const formData = new FormData();
      formData.append("title", rfqData.title);
      formData.append("projectName", rfqData.projectName);
      formData.append("purchaseNumber", rfqData.purchaseNumber);
      formData.append("quantity", String(rfqData.quantity));
      formData.append("category", rfqData.category);
      if (rfqData.detail) formData.append("detail", rfqData.detail);
      if (rfqData.deadline)
        formData.append("deadline", rfqData.deadline.toISOString());
      if (rfqData.auctionDoc) formData.append("auctionDoc", rfqData.auctionDoc);
      if (rfqData.guidelineDoc)
        formData.append("guidelineDoc", rfqData.guidelineDoc);

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await api.post(
        `/rfq/buyer/${buyerId}/create-rfq`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating RFQ:", error);
      throw handleApiError(error);
    }
  },

  async getRFQs(buyerId: string) {
    try {
      const response = await api.get(`/rfq/${buyerId}/view-all-rfqs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.sort(
        (a: RFQ, b: RFQ) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching RFQs:", error);
      throw handleApiError(error);
    }
  },

  async getRFQsSeller(sellerId: string) {
    try {
      const response = await api.get(`/rfq/${sellerId}/seller/view-all-rfqs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.sort(
        (a: RFQ, b: RFQ) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching seller RFQs:", error);
      throw handleApiError(error);
    }
  },

  async viewRFQ(rfqId: string) {
    try {
      const response = await api.get(`/rfq/${rfqId}/view-rfq`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error viewing RFQ:", error);
      throw handleApiError(error);
    }
  },

  async editRFQ(rfqId: string, rfqData: Partial<RFQData>): Promise<any> {
    try {
      const formData = new FormData();
      Object.entries(rfqData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "deadline" && value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (
            (key === "auctionDoc" || key === "guidelineDoc") &&
            value instanceof File
          ) {
            formData.append(key, value); // New file upload
          } else if (
            (key === "auctionDoc" || key === "guidelineDoc") &&
            typeof value === "string"
          ) {
            formData.append(key, value); // Existing URL
          } else {
            formData.append(key, String(value)); // Other fields
          }
        }
      });

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      // Debug FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.patch(`/rfq/${rfqId}/edit-rfq`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating RFQ:", error);
      throw handleApiError(error);
    }
  },

  async changeRFQState(rfqId: string, action: "open" | "close") {
    try {
      const response = await api.patch(
        `/rfq/${rfqId}/${action}-rfq`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error ${action}ing RFQ:`, error);
      throw handleApiError(error);
    }
  },

  async downloadRFQFile(rfqId: string, filename: string) {
    try {
      const response = await api.get(`/rfq/${rfqId}/${filename}`, {
        responseType: "blob", // To handle file download
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading RFQ file:", error);
      throw handleApiError(error);
    }
  },
  async deleteRFQ(rfqId: string): Promise<void> {
    try {
      await api.delete(`/rfq/${rfqId}/delete-rfq`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Error deleting RFQ:", error);
      throw handleApiError(error);
    }
  },
};
