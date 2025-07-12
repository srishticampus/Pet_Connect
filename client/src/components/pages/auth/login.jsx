import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth";
import { Link, useNavigate } from "react-router"; // Import useNavigate

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError, isLoading, isAuthenticated, user } = useAuth(); // Get login function, error, clearError, isLoading, and user from context
  const navigate = useNavigate(); // Hook for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAttempted, setLoginAttempted] = useState(false); // New state to track login attempt

  // Redirect if already authenticated on initial load
  useEffect(() => {
    if (isAuthenticated && !loginAttempted) {
      navigate("/logout-prompt");
    }
  }, [isAuthenticated, loginAttempted, navigate]);

  // Redirect after successful login attempt based on user role
  useEffect(() => {
    if (isAuthenticated && loginAttempted && !isLoading) {
      if (user && user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [isAuthenticated, loginAttempted, isLoading, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear any previous errors
    setLoginAttempted(true); // Set login attempted to true
    try {
      await login(email, password); // Call the login function from the context
      // Navigation will be handled by the useEffect hook
    } catch (err) {
      // Error is already handled by the AuthProvider and available in the context
      // No need to set error state here
      console.error("Login failed", err);
      setLoginAttempted(false); // Reset if login fails
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="px-8 py-6 mx-4 mt-4 text-left md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Login!</h1>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>} {/* Display error message */}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autocomplete="email"
            />
          </div>
          <div className="mt-4 relative">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autocomplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-7/12 right-3 text-gray-700 pr-3 flex items-center"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800">
              Forgot password?
            </Link>
          </div>
          <div className="mt-6 text-center">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="hover:text-gray-800">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
