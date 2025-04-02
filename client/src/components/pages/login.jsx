import { Button } from "../ui/button";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="px-8 py-6 mx-4 mt-4 text-left md:w-1/3 lg:w-1/3 sm:w-1/3">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold">Login!</h1>
        </div>
        <form className="mt-4">
          <div className="mt-4">
            <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
              Username
            </label>
            <input
              className="shadow-xs appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter email"
            />
          </div>
          <div className="mt-4">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow-xs appearance-none border rounded-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter password"
            />
          </div>
          <div className="mt-6 text-center">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
