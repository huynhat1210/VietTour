"use client";

import type { User } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
  }) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: {
    fullName?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    province?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
  }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.username || user.id}`);
      if (stored) {
        try {
          setFavorites(JSON.parse(stored));
        } catch {
          setFavorites([]);
        }
      } else {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = (slug: string) => {
    if (!user) {
      alert("Vui lòng đăng nhập để lưu tour yêu thích!");
      return;
    }
    setFavorites((prev) => {
      const updated = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      localStorage.setItem(`favorites_${user.username || user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = useCallback((slug: string) => {
    return favorites.includes(slug);
  }, [favorites]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
  };

  const register = async (formData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phone?: string;
  }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    if (data.verifyEmailRequired) {
      return data;
    }
    
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  const updateProfile = async (data: {
    fullName?: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    province?: string;
    district?: string;
    ward?: string;
    addressDetail?: string;
  }) => {
    const res = await fetch("/api/auth/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Không thể cập nhật thông tin");
    setUser(result.user);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/auth/avatar", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Không thể tải ảnh lên");
    // Update user in state with new avatar
    setUser((prev) => prev ? { ...prev, avatar: result.avatarUrl } : prev);
    return result.avatarUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        favorites,
        toggleFavorite,
        isFavorite,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
