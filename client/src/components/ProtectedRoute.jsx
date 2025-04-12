import { useAuth } from "../hooks/auth";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;