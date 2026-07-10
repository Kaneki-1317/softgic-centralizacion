import {
  createContext,
  useContext,
  useState,
} from "react";

import { login as loginRequest } from "../services/authApi";

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenValid(token) {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload) return false;
  return payload.exp * 1000 > Date.now();
}

function getNameFromToken(token) {
  const payload = parseJwt(token);
  return payload?.name ?? null;
}

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("token");
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid(storedToken));
  const [adminName, setAdminName] = useState(getNameFromToken(storedToken));

  async function login(email, password) {
    try {
      const data = await loginRequest(email, password);

      const token = data.token;
      localStorage.setItem("token", token);
      const name = getNameFromToken(token);
      setAdminName(name);
      setIsAuthenticated(true);
      return name;
    } catch {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAdminName(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
