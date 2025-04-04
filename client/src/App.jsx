import { Route, Routes } from "react-router";

import { AuthProvider } from "./hooks/auth";

import { Layout } from "./components/pages/layout";
import Landing from "./components/pages/landing";
import AuthForm from "./components/pages/auth";
import PetSearch from "./components/pages/pet-search";
import AdminLayout from "./components/pages/admin/layout";
import Dashboard from "./components/pages/admin/dashboard";
import About from "./components/pages/about";
import Login from "./components/pages/login";
import Contact from "./components/pages/contact";
import Fosters from "./components/pages/admin/fosters";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/pets" element={<PetSearch />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin/" element={<Dashboard />} />
          <Route path="/admin/fosters" element={<Fosters />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
