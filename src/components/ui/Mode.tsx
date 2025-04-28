import { FC, useState, useCallback } from "react";
import { cn } from "../../lib/utils";
import { UserMode } from "../../types/user";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user";
import { Spinner } from "./Spinner";

interface ModeProps {
  defaultMode?: UserMode;
}

const Mode: FC<ModeProps> = ({ defaultMode = "buyer" }) => {
  const { lastRole, setUser, token, fullName, id, clearUser } = useUser();
  const [mode, setMode] = useState<UserMode>(
    (lastRole as UserMode) || defaultMode
  );
  const [showSwitchButton, setShowSwitchButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleModeSwitch = useCallback(async () => {
    const newMode = mode === "buyer" ? "seller" : "buyer";
    setIsLoading(true);
    setError(null);

    try {
      if (!id) {
        throw new Error("User ID is required to switch roles.");
      }
      if (!token || !fullName) {
        console.error("Invalid context values:", { token, fullName });
        throw new Error("Authentication data missing. Please log in again.");
      }

      console.log("Switching role for user:", id, "to", newMode);
      const response = await userService.switchRole(id, newMode);
      console.log("Switch role response:", response);

      // Ensure mode aligns with backend response
      const updatedRole = response.lastRole || newMode;
      if (updatedRole !== newMode) {
        console.warn(
          "Backend role mismatch: expected",
          newMode,
          "got",
          updatedRole
        );
      }

      // Update localStorage
      localStorage.setItem("lastRole", updatedRole);

      // Update user context
      const updatedUser = {
        token,
        fullName,
        id,
        lastRole: updatedRole,
      };
      console.log("Updating user context:", updatedUser);
      setUser(updatedUser);

      // Update local state
      setMode(updatedRole as UserMode);
      setShowSwitchButton(false);

      // Navigate with extended delay to ensure context update
      const targetRoute = updatedRole === "seller" ? "/rfq-seller" : "/rfqs";

      setTimeout(() => {
        console.log("Executing navigation to:", targetRoute);
        navigate(targetRoute);
        // Keep loading until navigation completes
        setTimeout(() => setIsLoading(false), 100);
      }, 500);
    } catch (error: any) {
      console.error("Failed to switch role:", error);
      setError(error.message || "Failed to switch role. Please try again.");
      setIsLoading(false);
    }
  }, [mode, id, token, fullName, navigate, setUser]);

  return (
    <div className="relative px-4 py-2 mb-4 flex flex-col items-start">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="flex justify-center items-center h-screen">
          <Spinner color="border-blue-500" />
        </div>
      )}

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {/* Display the current mode */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={() => setShowSwitchButton((prev) => !prev)}
      >
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-2 border-primary"></div>
          <div className="absolute w-8 h-8 rounded-full border-2 border-dashed border-primary"></div>
          <span className="primary-color font-bold text-lg">
            {mode === "buyer" ? "B" : "S"}
          </span>
        </div>
        <span className="capitalize primary-color font-medium text-lg">
          {mode} Mode
        </span>
      </div>

      {/* Button to switch modes */}
      {showSwitchButton && (
        <button
          onClick={handleModeSwitch}
          disabled={isLoading}
          className={cn(
            "mt-2 px-4 py-2 text-white primary-color-bg rounded-md shadow-md transition",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
          )}
        >
          Switch to {mode === "buyer" ? "Seller" : "Buyer"} Mode
        </button>
      )}
    </div>
  );
};

export default Mode;
