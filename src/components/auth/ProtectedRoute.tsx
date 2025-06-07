import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[]; // Allowed user roles for this route
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);

  if (
    !auth?.isAuthenticated ||
    !(auth.user?.role && allowedRoles.includes(auth.user?.role))
  ) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in or for unauthorized user types
  }

  return <Outlet />;
};
