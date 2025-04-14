import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  roles?: string[];
}

export const RouteGuard = ({ children, roles = [] }: RouteGuardProps) => {
  const { token, userData, logout } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check token expiration
  const expiresAt = localStorage.getItem("expiresAt");
  if (expiresAt && new Date(expiresAt) < new Date()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Check roles if specified
  if (roles.length > 0 && (!userData?.role || !roles.includes(userData.role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
