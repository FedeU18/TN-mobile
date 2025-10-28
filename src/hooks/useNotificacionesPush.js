import { useEffect, useState } from 'react';
import * as Notificaciones from 'expo-notifications';
import * as Dispositivo from 'expo-device';
import { Platform } from 'react-native';

// Hook para gestionar notificaciones push en Expo
export default function useNotificacionesPush() {
  const [tokenPushExpo, setTokenPushExpo] = useState(null);
  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    registrarParaNotificacionesPush().then(token => setTokenPushExpo(token));
    const suscripcion = Notificaciones.addNotificationReceivedListener(notif => {
      setNotificacion(notif);
    });
    return () => suscripcion.remove();
  }, []);

  return { tokenPushExpo, notificacion };
}

// Solicita permisos y obtiene el token de notificaciones push
async function registrarParaNotificacionesPush() {
  let token;
  if (Dispositivo.isDevice) {
    const { status: estadoExistente } = await Notificaciones.getPermissionsAsync();
    let estadoFinal = estadoExistente;
    if (estadoExistente !== 'granted') {
      const { status } = await Notificaciones.requestPermissionsAsync();
      estadoFinal = status;
    }
    if (estadoFinal !== 'granted') {
      alert('No se pudo obtener permisos para notificaciones push.');
      return null;
    }
    token = (await Notificaciones.getExpoPushTokenAsync()).data;
  } else {
    alert('Las notificaciones push requieren un dispositivo físico.');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notificaciones.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notificaciones.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
