import React, { createContext, useState, useContext, useEffect } from "react";

type UserContextType = {
  token: string | null;
  fullName: string | null;
  id: string | null;
  lastRole: string | null; // Added lastRole
  setUser: (user: {
    token: string;
    fullName: string;
    id: string;
    lastRole: string;
  }) => void; // Updated setUser
  clearUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [fullName, setFullName] = useState<string | null>(() =>
    localStorage.getItem("fullName")
  );
  const [id, setId] = useState<string | null>(() =>
    localStorage.getItem("userId")
  );
  const [lastRole, setLastRole] = useState<string | null>(() =>
    // Added lastRole state
    localStorage.getItem("lastRole")
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (fullName) {
      localStorage.setItem("fullName", fullName);
    } else {
      localStorage.removeItem("fullName");
    }

    if (id) {
      localStorage.setItem("userId", id);
    } else {
      localStorage.removeItem("userId");
    }

    if (lastRole) {
      // Added lastRole storage
      localStorage.setItem("lastRole", lastRole);
    } else {
      localStorage.removeItem("lastRole");
    }
  }, [token, fullName, id, lastRole]);

  const setUser = (user: {
    token: string;
    fullName: string;
    id: string;
    lastRole: string;
  }) => {
    setToken(user.token);
    setFullName(user.fullName);
    setId(user.id);
    setLastRole(user.lastRole); // Set the lastRole
  };

  const clearUser = () => {
    setToken(null);
    setFullName(null);
    setId(null);
    setLastRole(null); // Clear the lastRole
    localStorage.removeItem("authToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userId");
    localStorage.removeItem("lastRole"); // Remove lastRole from localStorage
  };

  return (
    <UserContext.Provider
      value={{ token, fullName, id, lastRole, setUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
