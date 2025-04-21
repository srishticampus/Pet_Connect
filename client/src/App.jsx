import { Route, Routes, Navigate } from "react-router";

import { Layout } from "./components/pages/layout";
import LandingPage from "./components/pages";
import PetSearch from "./components/pages/pet-search";
import AdminLayout from "./components/pages/admin/layout";
import Dashboard from "./components/pages/admin/dashboard";
import About from "./components/pages/about";
import Login from "./components/pages/auth/login";
import Contact from "./components/pages/contact";
import Fosters from "./components/pages/admin/fosters";
import ForgotPassword from "./components/pages/auth/forgot-password";
import ResetPassword from "./components/pages/auth/reset-password";
import ChooseRegister from "./components/pages/auth/register/choose";
import PetOwnerSignUp from "./components/pages/auth/register/pet-owner";
import PetShopSignUp from "./components/pages/auth/register/pet-shop";
import VolunteerSignUp from "./components/pages/auth/register/volunteer";
import HomePage from "./components/pages/pet-owner/home";
import PetOwnerProfile from "./components/pages/pet-owner/profile";
import PetDetails from "./components/pages/pet-owner/pet-details";
import PetOwnersTable from "./components/pages/admin/pet-owners";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import ManagePets from "./components/pages/pet-owner/manage-pets";
import AddPet from "./components/pages/pet-owner/add-pet";
import { useAuth } from "./hooks/auth";

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  const isPetOwner = user?.role === "pet_owner";

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            isAuthenticated && isPetOwner ? (
              <HomePage />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated && isPetOwner ? (
              <HomePage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register">
          <Route index element={<ChooseRegister />} />
          <Route path="pet-owner" element={<PetOwnerSignUp />} />
          <Route path="pet-shop" element={<PetShopSignUp />} />
          <Route path="volunteer" element={<VolunteerSignUp />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<PetOwnerProfile />} />
        <Route path="/pet-details" element={<PetDetails />} />
        <Route path="/pet-owner/manage-pets" element={<ProtectedRoute><ManagePets /></ProtectedRoute>} />
        <Route path="/pet-owner/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
      </Route>

      <Route path="/pets" element={<PetSearch />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="fosters" element={<Fosters />} />
        <Route path="pet-owners" element={<PetOwnersTable />} />
      </Route>
    </Routes>
  );
}

export default App;
