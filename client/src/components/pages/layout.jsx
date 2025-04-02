import { Link, Outlet, useLocation } from "react-router";
import { Dog, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ user }) => {
  const { pathname } = useLocation();
  return (
    <nav className="py-6 ">
      <div className="container mx-auto px-4 lg:px-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dog className="text-[#E54C00]" size={28} />
          <p className="text-lg font-semibold">PetConnect</p>
        </div>

        {/* Conditional Navigation */}
        {/* Main Navigation - Always Visible */}
        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className="hover:text-[#E54C00] transition"
            style={{
              textDecoration: pathname === "/" ? "underline" : "none",
              color: pathname === "/" ? "#E54C00" : "",
            }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-[#E54C00] transition"
            style={{
              textDecoration: pathname === "/about" ? "underline" : "none",
              color: pathname === "/about" ? "#E54C00" : "",
            }}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:text-[#E54C00] transition"
            style={{
              textDecoration: pathname === "/contact" ? "underline" : "none",
              color: pathname === "/contact" ? "#E54C00" : "",
            }}
          >
            Contact
          </Link>
        </div>

        {user?.isSuperuser && (
          <div className="hidden md:flex gap-6">
            <Link
              to="/admin/dashboard"
              className="hover:text-[#E54C00] transition"
            >
              Dashboard
            </Link>
            <Link to="/admin/users" className="hover:text-[#E54C00] transition">
              Manage Users
            </Link>
            <Link to="/admin/pets" className="hover:text-[#E54C00] transition">
              Pet List
            </Link>
          </div>
        )}

        {!user && (
          <div className="flex gap-8 items-center">
            <Link to="/register" className="hover:text-[#E54C00] transition">
              Register
            </Link>
            <Button asChild>
              <Link to="/login">
                Login <MoveRight className="ml-2" size={16} />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#4c4c4c] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Dog className="text-[#E54C00]" size={48} />
              <p className="text-2xl font-semibold">PetConnect</p>
            </div>
            <p className="text-sm opacity-75">
              A compassionate platform dedicated to rescuing, rehabilitating,
              and rehoming pets.
            </p>
          </div>
          <nav className="flex-1 flex justify-end gap-8">
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-[#E54C00] transition">
                Home
              </Link>
              <Link to="/shop" className="hover:text-[#E54C00] transition">
                Shop
              </Link>
              <Link to="/about" className="hover:text-[#E54C00] transition">
                About
              </Link>
              <Link to="/contact" className="hover:text-[#E54C00] transition">
                Contact
              </Link>
            </div>
          </nav>
        </div>
        <div className="border-t border-white/20 mt-8 pt-4 text-center md:text-left">
          <p className="text-sm opacity-75">
            &copy; 2025 PetConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export const Layout = () => {
  return (
    <div className="bg-[#F6F7F9] text-[#4c4c4c] min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
