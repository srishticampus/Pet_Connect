import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react"; // Import useEffect
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router"; // Import useNavigate
import api from "@/utils/api"; // Import the api object

export default function ResetPassword() {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(""); // Add a state variable for message
  const [countdown, setCountdown] = useState(3); // Initialize countdown
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (message === "Password has been reset successfully.") {
      // Start countdown when the success message is set
      const intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Redirect after 3 seconds
      setTimeout(() => {
        clearInterval(intervalId); // Clear the interval
        navigate("/login"); // Redirect to login page
      }, 3000);

      return () => clearInterval(intervalId); // Cleanup on unmount
    }
  }, [message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match"); // Set the message for password mismatch
      return;
    }
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      setMessage(response.data.msg); // Set the message from the response
    } catch (error) {
      setMessage("An error occurred. Please try again."); // Set an error message
      console.error("Reset password error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="px-8 py-6 mx-4 mt-4 text-left md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
        </div>
        <p className="mt-2 text-center text-gray-600">
          Enter your new password below
        </p>
        {message === "Password has been reset successfully." ? (
          <p className="mt-2 text-center text-green-600">
            {message} Redirecting to login in {countdown}...
          </p>
        ) : (
          message && <p className="mt-2 text-center text-red-600">{message}</p>
        )}
        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="password">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mt-6 text-center">
            <Button type="submit">Reset Password</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
