import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set) => ({
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
      error: null 
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
        error: null,
        successMessage: 'Se envió un enlace de recuperación a tu correo electrónico'
      });

      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al enviar el enlace de recuperación';
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
        error: null,
        successMessage: 'Contraseña reseteada exitosamente'
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
}));

export default useAuthStore;