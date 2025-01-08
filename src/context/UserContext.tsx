import React, { createContext, useState, useContext, useEffect } from "react";

type UserContextType = {
  token: string | null;
  fullName: string | null;
  id: string | null; // Allow id to be string or null
  setUser: (user: { token: string; fullName: string; id: string }) => void; // Include id in the setUser method
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
  ); // State for id

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
      localStorage.setItem("userId", id); // Store id in localStorage
    } else {
      localStorage.removeItem("userId");
    }
  }, [token, fullName, id]);

  const setUser = (user: { token: string; fullName: string; id: string }) => {
    setToken(user.token);
    setFullName(user.fullName);
    setId(user.id); // Set the id when user logs in
  };

  const clearUser = () => {
    setToken(null);
    setFullName(null);
    setId(null); // Clear the id when user logs out
    localStorage.removeItem("authToken");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userId"); // Remove id from localStorage
  };

  return (
    <UserContext.Provider value={{ token, fullName, id, setUser, clearUser }}>
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
