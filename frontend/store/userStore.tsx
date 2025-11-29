import { create } from "zustand";
import api from "@/lib/backendUrl";
import { loginUser, signupUser } from "@/schema/user.schema";

const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export interface User {
  _id: string;
  email: string;
  name: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // actions
  register: (data: signupUser) => Promise<void>;
  login: (data: loginUser) => Promise<void>;
  profile: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  initializeAuth: () => {
    if (typeof window === "undefined") return;
    const storedToken = window.localStorage.getItem("token");
    if (storedToken) {
      setAuthHeader(storedToken);
      set({ token: storedToken });
    }
  },

  register: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post("/api/user/register", data);
      set({ user: res.data.user, loading: false });
    } catch (error: any) {
      console.log("Error in register store", error);
      set({ error: error?.message, loading: false });
    }
  },

  login: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post("/api/user/login", data);
      const token = res.data.token ?? null;

      if (token && typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
      }

      setAuthHeader(token);

      set({ user: res.data.user, token, loading: false });
    } catch (error: any) {
      console.log("Error in login store", error);
      const message =
        error.response?.data?.message || error.message || "Invalid credentials";
      set({ error: message, loading: false });
      throw new Error(message);
    } finally {
      set({ loading: false });
    }
  },

  profile: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/api/user/profile");
      set({ user: res.data.user, loading: false });
    } catch (error: any) {
      console.log("Error in getting logged in user", error);
      set({ error: error, loading: false });
    }
  },

  logout: async () => {
    try {
      set({ loading: true, error: null });
      await api.post("/api/user/logout");

      // Clear user data from store
      set({ user: null, token: null, loading: false });

      // Clear any cached API state
      setAuthHeader(null);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem("token");
      }

      // Force a page reload to clear any cached state
      window.location.href = "/";
    } catch (error: any) {
      console.log("Error in logout store", error);
      set({ error: error?.message || "Logout failed", loading: false });

      // Even if the API call fails, clear the local state
      set({ user: null });
      window.location.href = "/";
    }
  },
}));
