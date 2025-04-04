import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // Initialize token from localStorage on component mount
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });

  useEffect(() => {
    // Update localStorage whenever the token changes
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (e) => {
    e.preventDefault();
    const user = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("http://localhost:3000/api/auth", user, config)
      .then((res) => {
        setToken(res.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    setToken(null);
  };
  const value = {
    token,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 *
 * @returns {{
 *  token: (string | null),
 *  login: (e: React.FormEvent<HTMLFormElement>) => void,
 *  logout: () => void
 }} AuthContext
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
