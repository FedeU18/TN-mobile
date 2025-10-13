import * as Location from 'expo-location';
import api from './api';

export const solicitarPermisosUbicacion = async () => {
    try {
        // Solicitar permisos de ubicación en primer plano
        let { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Permiso de ubicación denegado');
        }

        // Solicitar permisos de ubicación en segundo plano
        const backgroundStatus = await Location.requestBackgroundPermissionsAsync();

        return {
            foreground: status === 'granted',
            background: backgroundStatus.status === 'granted'
        };
    } catch (error) {
        console.error('Error al solicitar permisos de ubicación:', error);
        throw error;
    }
};

export const obtenerUbicacionActual = async () => {
    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
            timeout: 10000,
        });

        return {
            latitud: location.coords.latitude,
            longitud: location.coords.longitude,
            precision: location.coords.accuracy,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error al obtener ubicación:', error);
        throw error;
    }
};

export const enviarUbicacionAlBackend = async (pedidoId, ubicacion) => {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/ubicacion`, {
            latitud: ubicacion.latitud,
            longitud: ubicacion.longitud,
            precision: ubicacion.precision,
            timestamp: ubicacion.timestamp
        });

        return response.data;
    } catch (error) {
        console.error('Error al enviar ubicación al backend:', error);
        throw error;
    }
};

export const verificarEstadoUbicacion = async () => {
    try {
        const enabled = await Location.hasServicesEnabledAsync();
        return enabled;
    } catch (error) {
        console.error('Error al verificar estado de servicios de ubicación:', error);
        throw error;
    }
};