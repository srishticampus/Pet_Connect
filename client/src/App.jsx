import { Route, Routes } from "react-router";
import PetConnectLanding from "./components/pages/landing/landing-page";
import AuthForm from "./components/pages/auth";
import PetSearch from "./components/pages/pet-search";
import AdminDashboard from "./components/pages/admin";
import About from "./components/pages/about/about";
import { Layout } from "./components/pages/layout";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<PetConnectLanding />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/pets" element={<PetSearch />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
