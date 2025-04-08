import { Route, Routes } from "react-router";

import { AuthProvider } from "./hooks/auth";

import { Layout } from "./components/pages/layout";
import Landing from "./components/pages";
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
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" >
            <Route index element={<ChooseRegister />} />
            <Route path="pet-owner" element={<PetOwnerSignUp />} />
            <Route path="pet-shop" element={<PetShopSignUp />} />
            <Route path="volunteer" element={<VolunteerSignUp />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<PetOwnerProfile />} />
        </Route>

        <Route path="/pets" element={<PetSearch />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="fosters" element={<Fosters />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
