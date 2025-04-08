
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
// import { useAuth } from "@/hooks/auth";

export default function ForgotPassword() {
  // const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await forgotPassword(email);
    // Optionally, provide feedback to the user (e.g., show a success message)
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
