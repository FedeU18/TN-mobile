import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

const handleApiError = (error, defaultMessage) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    defaultMessage
  );
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      successMessage: null,
      registeredEmail: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/login", { email, password });
          set({ token: data.token, user: data.user, isLoading: false });
          return { success: true, user: data.user, token: data.token };
        } catch (error) {
          const message = handleApiError(error, "Error en el login");
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await api.post("/auth/registro", userData);
          set({
            isLoading: false,
            successMessage: "Usuario creado con éxito",
            registeredEmail: userData.email,
          });
          return { success: true };
        } catch (error) {
          const message = handleApiError(error, "Error en el registro");
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      clearError: () => set({ error: null }),
      clearSuccessMessage: () =>
        set({ successMessage: null, registeredEmail: null }),

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/forgot-password", { email });
          set({ isLoading: false });
          return { success: true, data };
        } catch (error) {
          const message = handleApiError(
            error,
            "Error al enviar el enlace de recuperación"
          );
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      verifyResetToken: async (email, code) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/verify-reset-token", {
            email,
            code,
          });
          set({ isLoading: false });
          return { success: true, data };
        } catch (error) {
          const message = handleApiError(error, "Código inválido o expirado");
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },

      resetPassword: async (email, code, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post("/auth/reset-password", {
            email,
            code,
            newPassword,
          });
          set({ isLoading: false });
          return { success: true, data };
        } catch (error) {
          const message = handleApiError(
            error,
            "Error al resetear la contraseña"
          );
          set({ isLoading: false, error: message });
          return { success: false, error: message };
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
