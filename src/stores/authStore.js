import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

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
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      set({ 
        token,
        user,
        isLoading: false,
        error: null
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error en el login';
      set({ 
        isLoading: false, 
        error: errorMessage,
        user: null,
        token: null
      });
      return { success: false, error: errorMessage };
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/registro', userData);
      
      set({ 
        isLoading: false,
        error: null,
        successMessage: 'Usuario creado con éxito',
        registeredEmail: userData.email
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error en el registro';
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    set({ 
      user: null, 
      token: null, 
      error: null,
    });
  },

  clearError: () => set({ error: null }),

  clearSuccessMessage: () => set({ successMessage: null, registeredEmail: null }),

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      set({ 
        isLoading: false,
        error: null
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al enviar el enlace de recuperación';
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  verifyResetToken: async (token) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/verify-reset-token', { token });
      
      set({ 
        isLoading: false,
        error: null
      });

      return { success: true, valid: response.data.valid, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Token inválido o expirado';
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        newPassword 
      });
      
      set({ 
        isLoading: false,
        error: null
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al resetear la contraseña';
      set({ 
        isLoading: false, 
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  },
}),
{
  name: 'auth-storage', // nombre de la clave en AsyncStorage
  storage: createJSONStorage(() => AsyncStorage), // configuración del storage
  partialize: (state) => ({ 
    token: state.token, 
    user: state.user 
  }), 
}
));

export default useAuthStore;