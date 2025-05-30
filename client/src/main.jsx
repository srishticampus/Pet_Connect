import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import { AuthProvider } from "./hooks/auth"; // Import AuthProvider
import {Toaster} from "sonner"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider> {/* Wrap BrowserRouter with AuthProvider */}
      <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
        <App />
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  </StrictMode>,
);
