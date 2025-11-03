import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useNotificacionesPush from './useNotificacionesPush';
import api from '../utils/api';

export default function useRegistrarTokenPush() {
  const { user, token } = useAuthStore();
  const { tokenPushExpo } = useNotificacionesPush();

  useEffect(() => {
    if (user && tokenPushExpo && token) {
      // Enviar el token al backend
      const registrarToken = async () => {
        try {
          const response = await api.post('/users/push-token', { 
            token: tokenPushExpo 
          });
          console.log('✅ Token push registrado en el backend:', response.data);
        } catch (error) {
          console.error('❌ Error al registrar token push:', error.response?.data || error.message);
        }
      };
      
      registrarToken();
    }
  }, [user, tokenPushExpo, token]);
}
