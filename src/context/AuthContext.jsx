import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔁 Restore from sessionStorage on refresh
  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("authUser", JSON.stringify(userData));
    sessionStorage.setItem("firstTimeLogin", "true"); // ✅ FLAG FOR HOME TO REDIRECT
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("authUser");
    // 🏠 REDIRECT TO HOME
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
