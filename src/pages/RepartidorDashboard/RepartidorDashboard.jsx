
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import styles from './RepartidorDashboardStyles';
import useAuthStore from '../../stores/authStore';
import usarUbicacion from '../../hooks/usarUbicacion';
import { getWeatherForecast } from '../../utils/weatherApi';


export default function RepartidorDashboard({ navigation }) {
  const { user, logout } = useAuthStore();
  const { ultimaUbicacion, limpiarSeguimiento } = usarUbicacion();
  const [clima, setClima] = React.useState(null);
  const [loadingClima, setLoadingClima] = React.useState(false);
  const [errorClima, setErrorClima] = React.useState(null);


  React.useEffect(() => {
    if (!user) {
      limpiarSeguimiento();
    }
  }, [user]);

  // Obtener clima al entrar al dashboard
  React.useEffect(() => {
    const fetchClima = async () => {
      setLoadingClima(true);
      setErrorClima(null);
      try {
        let location = null;
        // Si hay ubicación reciente, usarla. Si no, usar ciudad por defecto
        if (ultimaUbicacion && ultimaUbicacion.latitud && ultimaUbicacion.longitud) {
          location = { latitud: ultimaUbicacion.latitud, longitud: ultimaUbicacion.longitud };
        } else {
          location = 'Neuquen'; // Puedes cambiar por la ciudad por defecto
        }
        const data = await getWeatherForecast(location);
        setClima(data);
      } catch (e) {
        setErrorClima('No se pudo obtener el clima');
      } finally {
        setLoadingClima(false);
      }
    };
    fetchClima();
  }, [ultimaUbicacion]);

  const handleLogout = () => {
    logout();
    // El App.jsx manejará automáticamente el cambio de navegación cuando el token se limpie
  };

  const navigateToPedidosDisponibles = () => {
    navigation.navigate('PedidosDisponibles');
  };

  const navigateToMisPedidos = () => {
    navigation.navigate('MisPedidos', { userRole: 'repartidor' });
  };


  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>¡Bienvenido {user?.nombre || 'Usuario'}!</Text>
        <Text style={styles.greeting}>
          Dashboard del rol Repartidor.
        </Text>
        <Text style={styles.subtitle}>
          Desde aquí podrás gestionar tus entregas y rutas.
        </Text>
      </View>

      {/* Clima actual y en 1 hora */}
      <View style={{ marginVertical: 16, alignItems: 'center' }}>
        {loadingClima ? (
          <ActivityIndicator size="small" color="#007aff" />
        ) : errorClima ? (
          <Text style={{ color: 'red' }}>{errorClima}</Text>
        ) : clima ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Clima actual</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              {clima.actual.icon && (
                <Image source={{ uri: 'https:' + clima.actual.icon }} style={{ width: 32, height: 32 }} />
              )}
              <Text style={{ marginLeft: 8 }}>
                {clima.actual.condition} ({clima.actual.temp}°C)
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>En 1 hora</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {clima.en1hora.icon && (
                <Image source={{ uri: 'https:' + clima.en1hora.icon }} style={{ width: 32, height: 32 }} />
              )}
              <Text style={{ marginLeft: 8 }}>
                {clima.en1hora.condition} ({clima.en1hora.temp}°C)
              </Text>
            </View>
          </View>
        ) : null}
      </View>


      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.primaryButton}
        onPress = {navigateToPedidosDisponibles}>
          <Text style={styles.primaryButtonText}>Pedidos Disponibles</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
        style={styles.secondaryButton}
        onPress={navigateToMisPedidos}>
          <Text style={styles.secondaryButtonText}>Mis Pedidos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Mi Perfil</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}