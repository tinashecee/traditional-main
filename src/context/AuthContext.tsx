import { createContext, useContext, useState, ReactNode } from "react";
import { LoginResponse } from "../lib/types";

interface AuthContextType {
  token: string | null;
  userData: {
    username: string;
    province: string;
    role: string;
    district: string;
  } | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(() => {
    const storedData = localStorage.getItem("userData");
    return storedData ? JSON.parse(storedData) : null;
  });

  const login = (newToken: string, newUserData: any) => {
    // Store token expiration (1 hour from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const userData = {
      username: newUserData.username,
      province: newUserData.province,
      role: newUserData.role,
      district: newUserData.district,
    };

    localStorage.setItem("token", newToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("expiresAt", expiresAt.toString());

    setToken(newToken);
    setUserData(userData);
  };

  const isTokenExpired = () => {
    const expiration = localStorage.getItem("expiresAt");
    if (!expiration) return true;
    return new Date(expiration) < new Date();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ token, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
