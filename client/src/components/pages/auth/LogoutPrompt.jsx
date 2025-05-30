import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { Link, useNavigate } from "react-router";
import { useEffect } from "react";

export default function LogoutPrompt() {
  const navigate = useNavigate();
  const { logout, isLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoading, isLoggedIn, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="px-8 py-6 mx-4 mt-4 text-left md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Already Logged In</h1>
        </div>
        <p className="mt-4 text-center text-gray-700">
          You are already logged in. Do you want to log out?
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <Button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? "Logging Out..." : "Log Out"}
          </Button>
          <Link to="/home">
            <Button variant="outline">Stay Logged In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
