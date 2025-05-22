import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api"; // Import the configured Axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true); // Start loading initially to check auth status
  const [error, setError] = useState(null);

  // Function to set auth state (token and user)
  const setAuthState = useCallback((token, userData) => {
    if (token) {
      localStorage.setItem("accessToken", token);
      setAccessToken(token);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update default header
    } else {
      localStorage.removeItem("accessToken");
      setAccessToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization']; // Remove default header
    }
    setError(null); // Clear any previous errors on successful state change
  }, []);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const currentToken = localStorage.getItem("accessToken");
      if (!currentToken) {
        setAuthState(null, null); // Ensure clean state if no token
        setIsLoading(false);
        return;
      }

      // If token exists, fetch user data
      try {
        const userDataResponse = await api.get('/auth/me'); // Assuming a /me endpoint exists
        console.log("User data response:", userDataResponse);
        setAuthState(currentToken, userDataResponse.data); // Use existing token

      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthState(null, null); // Clear state if fetching user fails
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuthState(data.accessToken, data.user); // Set token and user data
      return data.user; // Return user data on success
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || err?.response?.data?.error || err?.message?.error || "Login failed";
      console.error("Login error:", err.response?.data || err.message);
      setAuthState(null, null); // Clear state on login failure 
      setError(errorMsg);
      throw new Error(errorMsg); // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      // Log error but proceed with cleanup regardless
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      setAuthState(null, null); // Clear token and user data
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (role, userData, imageData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/auth/register/${role}`, userData);
      const userId = data.userId;

      if (imageData && (imageData.has('profilePic') || imageData.has('aadhaarImage'))) {
        await api.post(`/auth/register/${role}/${userId}/images`, imageData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      console.log("Registration response:", data);
      return { ...data, registrationComplete: true }; // Add a field to indicate completion
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || err?.response?.data?.error || err?.message?.error  || "Registration failed";
      console.error("Registration error:", err.response?.data || err.message);
      setError(errorMsg);
      throw new Error(errorMsg); // Re-throw for component handling
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!accessToken && !!user, // Consider user presence for full auth
    isLoading,
    error,
    login,
    logout,
    register,
    clearError: () => setError(null) // Utility to clear errors manually if needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the AuthContext.
 * @returns {{
 *  user: object | null,
 *  accessToken: string | null,
 *  isAuthenticated: boolean,
 *  isLoading: boolean,
 *  error: string | null,
 *  login: (email, password) => Promise<object>,
 *  logout: () => Promise<void>,
 *  register: (userData) => Promise<object>,
 *  clearError: () => void
 * }} AuthContext values
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // If context is null during initial load, provide default loading state
  if (context === null) {
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
      login: async () => { throw new Error("AuthProvider not ready"); },
      logout: async () => { throw new Error("AuthProvider not ready"); },
      register: async () => { throw new Error("AuthProvider not ready"); },
      clearError: () => { }
    };
  }
  return context;
};
