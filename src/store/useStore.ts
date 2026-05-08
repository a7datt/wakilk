import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "client" | "developer" | "admin";
  balance: number;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  fetchUser: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  user: null, 
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchUser: async (id: string) => {
    try {
      const res = await fetch(`/api/user/${id}`);
      const data = await res.json();
      set({ user: data });
    } catch (e) {
      console.error("Failed to fetch user", e);
    }
  }
}));
