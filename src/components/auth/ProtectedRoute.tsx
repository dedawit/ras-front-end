import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTokenRefresh } from "../../hooks/useTokenRefresh";
import { useUser } from "../../context/UserContext";
import { Spinner } from "../ui/Spinner";

interface ProtectedRouteProps {
  roles?: string[];
  component?: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles,
  component,
}) => {
  const { token, fullName, id, lastRole } = useUser();
  const [isChecking, setIsChecking] = useState(true);
  useTokenRefresh();

  // Show loading state while checking

  // Check if user is authenticated
  const isAuthenticated = token && fullName && id && lastRole;

  if (!isAuthenticated) {
    console.log("Redirecting to /login: Not authenticated", {
      token,
      fullName,
      id,
      lastRole,
    });
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (roles && !roles.includes(lastRole)) {
    const fallbackRoute = lastRole === "buyer" ? "/rfqs" : "/rfq-seller";
    return <Navigate to={fallbackRoute} />;
  }

  // Render the component or nested routes
  return component ? component : <Outlet />;
};
