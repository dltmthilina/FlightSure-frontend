import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[]; // Allowed roles for this route
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);

  const isAuthenticated = auth?.isAuthenticated;
  const role = auth?.user?.role;
  console.log(role);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && allowedRoles.includes(role)) {
    console.log(role);
    return <Outlet />;
  }

  // Redirect based on user role
  switch (role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    case "CUSTOMER":
      return <Navigate to="/customer" replace />;
    case "OPERATOR":
      return <Navigate to="/operator" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};
