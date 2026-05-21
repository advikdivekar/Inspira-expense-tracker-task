import { createContext, useState, useEffect } from "react";
import { loginAdmin } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem("admin_token"));

  const login = async (username, password) => {
    const data = await loginAdmin(username, password);
    localStorage.setItem("admin_token", data.access_token);
    setToken(data.access_token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsAdmin(false);
  };

  // keep state in sync if token is cleared externally (e.g. by axios interceptor on 401)
  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      setToken(null);
      setIsAdmin(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};