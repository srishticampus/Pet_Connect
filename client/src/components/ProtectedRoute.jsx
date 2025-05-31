import { useAuth } from "../hooks/auth";
import { Navigate, useLocation } from "react-router";
import { Skeleton } from './ui/skeleton';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading,user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="ml-2 h-4 w-[250px]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is an Admin, redirect them to the home page
  if (user?.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
