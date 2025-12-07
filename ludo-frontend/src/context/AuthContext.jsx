// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("ludo_user")) || null
  );
  const [token, setToken] = useState(() => localStorage.getItem("ludo_token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OFFLINE-ONLY: no API calls, just fake user
  const register = async (username, email, password) => {
    setLoading(true);
    setError("");
    try {
      const fakeUser = {
        id: "offline-user",
        username,
        email,
        wins: 0,
        losses: 0,
        xp: 0,
        level: 1,
      };

      setUser(fakeUser);
      setToken("offline-token");

      localStorage.setItem("ludo_user", JSON.stringify(fakeUser));
      localStorage.setItem("ludo_token", "offline-token");

      // just to show info on screen if you want
      setError("Using offline demo user (backend DB not connected).");

      return true;
    } catch (e) {
      console.error(e);
      setError("Unexpected error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const fakeUser = {
        id: "offline-user",
        username: email.split("@")[0] || "Player",
        email,
        wins: 0,
        losses: 0,
        xp: 0,
        level: 1,
      };

      setUser(fakeUser);
      setToken("offline-token");

      localStorage.setItem("ludo_user", JSON.stringify(fakeUser));
      localStorage.setItem("ludo_token", "offline-token");

      setError("Using offline demo user (backend DB not connected).");

      return true;
    } catch (e) {
      console.error(e);
      setError("Unexpected error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ludo_user");
    localStorage.removeItem("ludo_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
