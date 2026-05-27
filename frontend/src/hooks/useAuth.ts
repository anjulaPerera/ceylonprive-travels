"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User } from "@/types/models";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // On mount, check if a token exists in localStorage.
  // If it does, verify it's still valid by calling /api/auth/me.
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("ceylonprive_token");

      if (!storedToken) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await api.get("/api/auth/me");
        setAuthState({
          user: response.data.user,
          token: storedToken,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch {
        // Token is invalid or expired — clean up
        localStorage.removeItem("ceylonprive_token");
        setAuthState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("ceylonprive_token", token);
      setAuthState({
        user,
        token,
        isLoading: false,
        isAuthenticated: true,
      });

      router.push("/dashboard");
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Logout even if the API call fails
    } finally {
      localStorage.removeItem("ceylonprive_token");
      setAuthState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push("/admin/login");
    }
  }, [router]);

  return { ...authState, login, logout };
}
