import { Route, Routes } from "react-router";
import Landing from "./components/pages/landing";
import AuthForm from "./components/pages/auth";
import PetSearch from "./components/pages/pet-search";
import AdminDashboard from "./components/pages/admin";
import About from "./components/pages/about";
import { Layout } from "./components/pages/layout";
import Login from "./components/pages/login";
import { AuthProvider } from "./lib/auth";
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/pets" element={<PetSearch />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
