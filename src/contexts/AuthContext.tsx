import { createContext, useState, useEffect, ReactNode } from "react";
import { LoginResponse } from "../types/auth";
import { User } from "../types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (loginResponse: LoginResponse) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState<User | null>(
    storedUser ? JSON.parse(storedUser) : null
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const login = async (loginResponse: LoginResponse) => {
    setIsAuthenticated(true);
    setToken(loginResponse.token);
    setUser(loginResponse.user);
    localStorage.setItem("user", JSON.stringify(loginResponse.user));
    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("isAuthenticated", "true");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
