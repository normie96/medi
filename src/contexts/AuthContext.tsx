import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types/index.js";
import { api } from "../services/api.js";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, lang?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    try {
      const data = await api.getProfile();
      setUser(data);
    } catch (e) {
      // Default to demo user so features are instantly accessible
      setUser({
        id: "user-demo-01",
        email: "demo@medilens.health",
        name: "Alex Marak",
        preferredLanguage: "ENGLISH",
        simpleLanguageMode: false,
        textSize: "MEDIUM",
        contrastMode: "NORMAL",
        speechEnabled: true,
        speechSpeed: "NORMAL",
        speechLanguage: "ENGLISH"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, lang = "ENGLISH") => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, pass, lang);
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
