import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import api from "@/utils/api"; // Import the api object

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Add a state variable for message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/forgot-password", { email });
      setMessage(response.data.msg); // Set the message from the response
    } catch (error) {
      setMessage("An error occurred. Please try again."); // Set an error message
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="px-8 py-6 mx-4 mt-4 text-left md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
        </div>
        <p className="mt-2 text-center text-gray-600">
          Enter your E-mail below to receive your password reset instruction
        </p>
        {message && <p className="mt-2 text-center text-green-600">{message}</p>} {/* Display the message */}
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
              autocomplete="email"
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
