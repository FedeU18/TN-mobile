import axios from "axios";
import { EXPO_CONFIG } from "../config/expo.config";

const api = axios.create({
  baseURL:
    `${process.env.EXPO_PUBLIC_API_BASE_URL}/api` || EXPO_CONFIG.getAPIUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Obtener token del store de Zustand
    // Importamos dinámicamente el store solo cuando lo necesitamos
    const { default: useAuthStore } = require("../stores/authStore");
    const token = useAuthStore.getState().token;

    // Agregarlo al header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar tokens expirados o inválidos
    if (error.response?.status === 401 || error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || "";

      // Si el error indica token expirado/inválido, hacer logout automático
      if (
        errorMessage.includes("Token inválido") ||
        errorMessage.includes("Token expirado") ||
        errorMessage.includes("token") ||
        error.response?.status === 401
      ) {
        // Hacer logout usando el store
        const { default: useAuthStore } = require("../stores/authStore");
        useAuthStore.getState().logout();

        Alert.alert(
          "Sesión Expirada",
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
