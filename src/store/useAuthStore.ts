import { create } from "zustand";
import { AuthState } from "../types/common";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!sessionStorage.getItem("token"),
  adminId: sessionStorage.getItem("adminId"),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setAdminId: (adminId) => set({ adminId }),
}));
