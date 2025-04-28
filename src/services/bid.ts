import axios from "axios";
import api from "../config/axios";
import { Bid } from "../types/bid";
import { handleApiError } from "../utils/errorHandler";

// Interface for Bid data
export interface BidItemData {
  item: string;
  quantity: number;
  unit: string;
  singlePrice: number;
  transportFee?: number | null;
  taxes?: number | null;
  totalPrice: number;
}

export interface BidData {
  rfqId?: string;
  totalPrice: number;
  bidItems: BidItemData[];
  bidFiles?: File | null; // Zip file for upload
}

export const bidService = {
  /**
   * Create a new Bid with a mandatory zip file
   */
  async createBid(sellerId: string, bidData: BidData) {
    try {
      console.log(bidData);
      // Prepare the payload according to DTO structure
      const payload = {
        rfqId: bidData.rfqId,
        totalPrice: Number(bidData.totalPrice),
        bidItems: bidData.bidItems.map((item) => ({
          item: item.item,
          quantity: Number(item.quantity),
          unit: item.unit,
          singlePrice: Number(item.singlePrice),
          transportFee: item.transportFee ? Number(item.transportFee) : 0,
          taxes: item.taxes ? Number(item.taxes) : 0,
          totalPrice: Number(item.totalPrice),
        })),
      };

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      if (bidData.bidFiles) {
        formData.append("bidFiles", bidData.bidFiles);
      }

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await api.post(
        `/bid/seller/${sellerId}/create-bid`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating Bid:", error);
      if (axios.isAxiosError(error)) {
        console.error("Backend validation errors:", error.response?.data);
      }
      throw handleApiError(error);
    }
  },

  /**
   * Get all Bids for an RFQ
   */
  async getBidsByRFQ(rfqId: string) {
    try {
      const response = await api.get(`/bid/rfq/${rfqId}/view-all-bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data.sort(
        (a: Bid, b: Bid) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching Bids for RFQ:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Get all Bids created by a seller
   */
  async getBidsBySeller(sellerId: string) {
    try {
      const response = await api.get(`/bid/seller/${sellerId}/view-all-bids`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(response.data);

      return response.data.sort(
        (a: Bid, b: Bid) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching seller Bids:", error);
      throw handleApiError(error);
    }
  },

  /**
   * View a specific Bid by ID
   */
  async viewBid(bidId: string) {
    try {
      const response = await api.get(`/bid/${bidId}/view-bid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error viewing Bid:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Delete a Bid
   */
  async deleteBid(bidId: string): Promise<void> {
    try {
      await api.delete(`/bid/${bidId}/delete-bid`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Error deleting Bid:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Download the Bid zip file
   */
  async downloadBidFile(bidId: string, filename: string) {
    try {
      const response = await api.get(`/bid/${bidId}/file/${filename}`, {
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
      console.error("Error downloading Bid file:", error);
      throw handleApiError(error);
    }
  },
  /**
   * Update an existing Bid with an optional zip file
   */
  async editBid(bidId: string, bidData: BidData): Promise<Bid> {
    try {
      const formData = new FormData();

      // Append required fields
      formData.append("id", bidId);
      formData.append("totalPrice", String(Number(bidData.totalPrice)));

      // Prepare bidItems as an array of objects
      const bidItems = bidData.bidItems.map((item) => ({
        item: String(item.item || ""),
        quantity: Number(item.quantity || 0),
        unit: String(item.unit || "pcs"),
        singlePrice: Number(item.singlePrice || 0),
        transportFee: item.transportFee ? Number(item.transportFee) : 0,
        taxes: item.taxes ? Number(item.taxes) : 0,
        totalPrice: Number(item.totalPrice || 0),
      }));
      formData.append("bidItems", JSON.stringify(bidItems));

      // Append bidFiles (File or string)
      if (bidData.bidFiles instanceof File) {
        formData.append("bidFiles", bidData.bidFiles); // New file
      } else if (typeof bidData.bidFiles === "string") {
        formData.append("bidFiles", bidData.bidFiles); // Existing URL
      }

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      // Debug FormData contents
      console.log("FormData contents:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.patch(`/bid/${bidId}/edit-bid`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update bid response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating Bid:", error);
      if (axios.isAxiosError(error)) {
        console.error("Backend validation errors:", error.response?.data);
      }
      throw handleApiError(error);
    }
  },
  /**
   * Award a Bid (only accessible to buyers)
   */
  async awardBid(bidId: string): Promise<string> {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await api.patch(
        `/bid/buyer/${bidId}/award`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Bid awarded:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error awarding Bid:", error);
      throw handleApiError(error);
    }
  },
};
