import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("auth-token");
    const savedUser = localStorage.getItem("auth-user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    };

    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem("auth-token", data.data.token);
      localStorage.setItem("auth-user", JSON.stringify(data.data));
      return { success: true };
    };

    return { success: false, message: data.message };
  };

  // Register function
  const register = async (name, email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      setToken(data.data.token);
      setUser(data.data);
      localStorage.setItem("auth-token", data.data.token);
      localStorage.setItem("auth-user", JSON.stringify(data.data));
      return { success: true };
    };

    return { success: false, message: data.message };
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
    localStorage.removeItem("current-page-id");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );

};

// Custom hook to use auth
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
