import { Button } from "../ui/button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { useAuth } from "@/hooks/auth";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="px-8 py-6 mx-4 mt-4 text-left md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Login!</h1>
        </div>
        <form className="mt-4" onSubmit={login}>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Email
            </label>
            <Input id="email" type="email" placeholder="Enter email" />
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
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-7/12 right-3 text-gray-700 pr-3 flex items-center"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="mt-6 text-center">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
