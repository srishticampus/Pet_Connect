import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { Dog, MoveRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/auth";
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import api from '@/utils/api'; // Import the API client

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [loadingUnreadCount, setLoadingUnreadCount] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchTotalUnreadCount = async () => {
      if (!isAuthenticated) {
        setTotalUnreadCount(0);
        setLoadingUnreadCount(false);
        return;
      }
      try {
        setLoadingUnreadCount(true);
        const response = await api.get('/chat/unread-count');
        setTotalUnreadCount(response.data.totalUnreadCount);
      } catch (err) {
        console.error("Error fetching total unread count:", err);
        setTotalUnreadCount(0); // Assume 0 on error
      } finally {
        setLoadingUnreadCount(false);
      }
    };

    fetchTotalUnreadCount();

    // Optional: Poll for new messages periodically (e.g., every 30 seconds)
    const pollingInterval = setInterval(fetchTotalUnreadCount, 30000);

    return () => clearInterval(pollingInterval); // Cleanup interval on unmount or dependency change

  }, [isAuthenticated]); // Rerun when authentication status changes


  return (
    <nav className="py-6 ">
      <div className="container mx-auto px-4 lg:px-0 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Dog className="text-primary" size={28} />
          <p className="text-lg font-semibold">PetConnect</p>
        </div>

        {/* Conditional Navigation */}
        {/* Main Navigation - Always Visible */}
        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className="hover:text-primary transition"
            style={{
              textDecoration: pathname === "/" ? "underline" : "none",
              color: pathname === "/" ? "#E54C00" : "",
            }}
          >
            Home
          </Link>
          {!isAuthenticated && (
            <>
              <Link
                to="/about"
                className="hover:text-primary transition"
                style={{
                  textDecoration: pathname === "/about" ? "underline" : "none",
                  color: pathname === "/about" ? "#E54C00" : "",
                }}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition"
                style={{
                  textDecoration: pathname === "/contact" ? "underline" : "none",
                  color: pathname === "/contact" ? "#E54C00" : "",
                }}
              >
                Contact
              </Link>
            </>
          )}
        </div>

        {user?.role === 'admin' && (
          <div className="hidden md:flex gap-6">
            <Link
              to="/admin"
              className="hover:text-primary transition"
            >
              Dashboard
            </Link>
            {/* <Link to="/admin/users" className="hover:text-primary transition">
              Manage Users
            </Link>
            <Link to="/admin/pets" className="hover:text-primary transition">
              Pet List
            </Link> */}
          </div>
        )}

        {isAuthenticated && user?.role !== 'admin' && (
          <div className="hidden md:flex gap-6">
            {user?.role === 'pet_owner' && (
              <>
                <Link
                  to="/pet-owner/manage-pets"
                  className="hover:text-primary transition"
                >
                  Manage Pets
                </Link>
                <Link
                  to="/pet-owner/find-pet"
                  className="hover:text-primary transition"
                >
                  Find Pet
                </Link>
                <Link
                  to="/pet-owner/manage-lost-found"
                  className="hover:text-primary transition"
                >
                  Lost/Found Reports
                </Link>
              </>
            )}
          
            {user?.role === 'rescue-shelter' && (
              <>
                <Link
                  to="/rescue-shelter/manage-pets"
                  className="hover:text-primary transition"
                >
                  Manage Pets
                </Link>
                <Link
                  to="/rescue-shelter/applications"
                  className="hover:text-primary transition"
                >
                  Applications
                </Link>
                <Link
                  to="/rescue-shelter/lost-found-reports"
                  className="hover:text-primary transition"
                >
                  Lost & Found Reports
                </Link>
                <Link
                  to="/rescue-shelter/adopted-pets"
                  className="hover:text-primary transition"
                >
                  Adopted Pets
                </Link>
                <Link
                  to="/rescue-shelter/fostered-pets"
                  className="hover:text-primary transition"
                >
                  Fostered Pets
                </Link>
              </>
            )}
            {user?.role === 'foster' && (
              <>
                <Link
                  to="/foster/pets"
                  className="hover:text-primary transition"
                >
                  Foster Pets
                </Link>
                <Link
                  to="/foster/application-status"
                  className="hover:text-primary transition"
                >
                  Application Status
                </Link>
                <Link
                  to="/foster/assigned-pets"
                  className="hover:text-primary transition"
                >
                  Assigned Pets
                </Link>
              </>
            )}
            {user?.role === 'adopter' && (
              <>
                <Link
                  to="/adopter/adopt-a-pet"
                  className="hover:text-primary transition"
                  style={{
                    textDecoration: pathname === "/adopt-a-pet" ? "underline" : "none",
                    color: pathname === "/adopt-a-pet" ? "#E54C00" : "",
                  }}
                >
                  Adopt pets
                </Link>
                <Link
                  to="/adopter/application-status"
                  className="hover:text-primary transition"
                  style={{
                    textDecoration: pathname === "/adopter/application-status" ? "underline" : "none",
                    color: pathname === "/adopter/application-status" ? "#E54C00" : "",
                  }}
                >
                  Application Status
                </Link>
                <Link
                  to="/adopter/adopted-pets"
                  className="hover:text-primary transition"
                  style={{
                    textDecoration: pathname === "/adopter/adopted-pets" ? "underline" : "none",
                    color: pathname === "/adopter/adopted-pets" ? "#E54C00" : "",
                  }}
                >
                  Adopted Pets
                </Link>
              </>
            )}
            <Link
              // to={`/${user?.role}/profile`} // Using user.role as confirmed
              to={`/profile`}
              className="hover:text-primary transition"
            >
              Profile
            </Link>
            <Link
              to="/chat"
              className="hover:text-primary transition relative" // Added relative positioning
            >
              <MessageSquare size={24} />
              {!loadingUnreadCount && totalUnreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-red-500" /> // Red bubble
              )}
            </Link>
            <Button onClick={handleLogout} variant="default" size="sm">
              Logout
            </Button>
          </div>
        )}

        {!isAuthenticated && (
          <div className="flex gap-8 items-center">
            <Link to="/register" className="hover:text-primary transition">
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

const Footer = ({ isAuthenticated }) => {
  return (
    <footer className="bg-[#4c4c4c] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Dog className="text-primary" size={48} />
              <p className="text-2xl font-semibold">PetConnect</p>
            </div>
            <p className="text-sm opacity-75">
            A compassionate platform dedicated to rescuing, rehabilitating, and rehoming pets while supporting animal welfare through community efforts.
            </p>
          </div>
          <nav className="flex-1 flex justify-end gap-8">
            <div className="flex flex-col gap-2">
              <Link to="/" className="hover:text-primary transition">
                Home
              </Link>
              {/* <Link to="/shop" className="hover:text-primary transition">
                Shop
              </Link> */}
              {!isAuthenticated && (
                <>
                  <Link to="/about" className="hover:text-primary transition">
                    About
                  </Link>
                  <Link to="/contact" className="hover:text-primary transition">
                    Contact
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
        <div className="border-t border-white/20 mt-8 pt-4 flex justify-between items-baseline text-center md:text-left">
          <p className="text-sm opacity-75">
            &copy; {new Date().getFullYear()} Pet Connect. All rights reserved.
          </p>
          <div className="flex gap-2">
            <Link to="/terms-of-service" className="hover:text-primary transition text-sm underline">
              Terms of Service
            </Link>
            <Link to="/about-privacy" className="hover:text-primary transition text-sm underline">
              Privacy Policy
            </Link>
            <Link to="/faq" className="hover:text-primary transition text-sm underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout = () => {
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from useAuth

  return (
    <div className="bg-[#F6F7F9] text-[#4c4c4c] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
      <Outlet />
      </div>
      <Footer isAuthenticated={isAuthenticated} /> {/* Pass isAuthenticated as a prop */}
    </div>
  );
};
