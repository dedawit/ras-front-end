// src/utils/networkErrorHandler.ts
export const handleNetworkError = (error: unknown): string => {
  if (!navigator.onLine) {
    return "No internet connection. Please check your network and try again.";
  }

  if (error instanceof Error) {
    // Specific network-related error handling
    if (error.message.includes("Network Error")) {
      return "Failed to connect to the server. Please try again later.";
    }
    return error.message; // Return the error message if available
  }

  // Generic fallback message
  return "An unexpected error occurred. Please try again.";
};
