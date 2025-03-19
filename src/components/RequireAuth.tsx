import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || 'null');
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default RequireAuth;
