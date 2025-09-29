import axios from 'axios';
import { EXPO_CONFIG } from '../config/expo.config';

const api = axios.create({
  baseURL: EXPO_CONFIG.getAPIUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {

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
    console.error('Error en la API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;