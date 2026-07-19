"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCurrentUser() {
    const response = await api.get("/auth/me");
    setUser(response.data.user);
  }

  async function refreshUser() {
    try {
      await fetchCurrentUser();
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    async function loadUser() {
      try {
        await fetchCurrentUser();
      } catch {
        try {
          await api.post("/auth/refresh");
          await fetchCurrentUser();
        } catch {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
