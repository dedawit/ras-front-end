import { AxiosError } from "axios";
import { ApiError } from "../types/auth";

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    return {
      message:
        error.response?.data?.message || "An error occurred, try again later",
      code: error.response?.data?.code,
      status: error.response?.status,
    };
  }

  return {
    message: "An unexpected error occurred",
  };
};
