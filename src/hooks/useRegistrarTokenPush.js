import { useEffect } from 'react';
import useAuthStore from '../stores/authStore';
import useNotificacionesPush from './useNotificacionesPush';
import api from '../utils/api';

export default function useRegistrarTokenPush() {
  const { user, token } = useAuthStore();
  const { tokenPushExpo } = useNotificacionesPush();

  useEffect(() => {
    if (user && tokenPushExpo) {
      // Enviar el token al backend
      // api.post('/users/push-token', { userId: user.id, token: tokenPushExpo });
    }
  }, [user, tokenPushExpo]);
}
