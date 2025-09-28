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

      const { token } = response.data;
      
      set({ 
        token,
        isLoading: false,
        error: null
      });

      return { success: true };
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
}));

export default useAuthStore;