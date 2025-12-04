import { create } from "zustand";
import { type User } from "../types";
import { authService } from "../services/api";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: "author" | "reader"
  ) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token, error: null });
  },

  clearAuth: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null, error: null });
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login({ email, password });
      get().setAuth(user, token);
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Login failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, name, role) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register({
        email,
        password,
        name,
        role,
      });
      get().setAuth(user, token);
    } catch (error: any) {
      set({ error: error.response?.data?.error || "Registration failed" });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    get().clearAuth();
    window.location.href = "/login";
  },

  loadUser: async () => {
    const token = get().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authService.getProfile();
      set({ user });
    } catch (error) {
      get().clearAuth();
    } finally {
      set({ isLoading: false });
    }
  },
}));
