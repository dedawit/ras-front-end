import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export const useTokenRefresh = () => {
  const { token, fullName, id, lastRole, setUser, clearUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip if user is not logged in
    if (!token || !fullName || !id || !lastRole) {
      return;
    }

    const REFRESH_INTERVAL = 50 * 60 * 1000; // 50 minutes in milliseconds

    const refreshAccessToken = async () => {
      try {
        const newToken = await authService.refreshToken();
        setUser({
          token: newToken,
          fullName,
          id,
          lastRole,
        });
      } catch (error) {
        clearUser();
        // console.log("error", error);
        navigate("/login");
      }
    };

    // Initial refresh attempt
    // refreshAccessToken();

    // Set up interval for periodic refresh
    const intervalId = setInterval(refreshAccessToken, REFRESH_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [token, fullName, id, lastRole, setUser, clearUser, navigate]);
};
