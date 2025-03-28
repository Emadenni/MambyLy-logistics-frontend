import { create } from "zustand";
import { AuthState } from "../types/common";

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!sessionStorage.getItem("token"),
  adminId: sessionStorage.getItem("adminId"),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setAdminId: (adminId) => set({ adminId }),
  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminId");
    set({ isAuthenticated: false, adminId: null });
  },
  handleUnauthorized: () => {
    
    sessionStorage.setItem("logoutMessage", "Your session has expired. Please log in again.");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("adminId");
    set({ isAuthenticated: false, adminId: null });
  },
}));
