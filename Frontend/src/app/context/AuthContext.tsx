"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) {
        setLoading(false);
        return;
      }
      await fetchUser(savedToken);
    };
    initializeAuth();
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.user || res.data);
    } catch (err) {
      setUser(null);
      localStorage.removeItem("token");
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      handleSetToken(null);
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black text-gray-700 dark:text-gray-300">
        <div className="animate-pulse text-xl font-medium"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, setUser, setToken: handleSetToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
