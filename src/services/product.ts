import axios from "../config/axios";
import { Product, ProductData } from "../types/product";
import { handleApiError } from "../utils/errorHandler";

export const productService = {
  /**
   * Creates a new product
   */
  async createProduct(
    userId: string,
    productData: ProductData
  ): Promise<Product> {
    try {
      const formData = new FormData();
      formData.append("title", productData.title);
      formData.append("category", productData.category);
      if (productData.detail) formData.append("detail", productData.detail);
      if (productData.image) formData.append("image", productData.image);

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(`/product/${userId}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Retrieves all products for a user
   */
  async getProducts(userId: string): Promise<Product[]> {
    try {
      const response = await axios.get(`/product/${userId}/view-all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log("Fetched products:", response.data); // Debugging line
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Retrieves a single product by ID
   */
  async viewProduct(productId: string): Promise<Product> {
    try {
      const response = await axios.get(`/product/${productId}/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error viewing product:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Updates an existing product
   */
  async editProduct(
    productId: string,
    productData: Partial<ProductData>
  ): Promise<Product> {
    try {
      const formData = new FormData();
      if (productData.title) formData.append("title", productData.title);
      if (productData.category)
        formData.append("category", productData.category);
      if (productData.detail !== undefined)
        formData.append("detail", productData.detail || "");
      if (productData.image) formData.append("image", productData.image);

      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found");

      // Debug FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.patch(
        `/product/${productId}/edit`,
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
      console.error("Error updating product:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Deletes a product
   */
  async deleteProduct(productId: string): Promise<void> {
    try {
      await axios.delete(`/product/${productId}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw handleApiError(error);
    }
  },

  /**
   * Retrieves all products for public view (no authentication)
   */
  async getPublicProducts(): Promise<Product[]> {
    try {
      const response = await axios.get("/product/view-all-public");
      // console.log("Fetched public products:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching public products:", error);
      throw handleApiError(error);
    }
  },
};
