import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

export const GuestOnly = () => {
  const value = useContext(AuthContext);
  if (value.isAuthenticated) {
    return <Navigate to={{ pathname: "/admin" }} replace />;
  }
  return <Outlet />;
};
