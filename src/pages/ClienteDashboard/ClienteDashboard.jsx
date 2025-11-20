import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from './ClienteDashboardStyles';
import useAuthStore from '../../stores/authStore';

export default function ClienteDashboard({ navigation }) {
  const { user, logout } = useAuthStore();

  const navigateToMisPedidos = () => {
    navigation.navigate('MisPedidos', { userRole: 'cliente' });
  };

  const navigateToPerfil = () => {
    navigation.navigate('Perfil');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Cerrar sesión',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>¡Bienvenido {user?.nombre || 'Usuario'}!</Text>
        <Text style={styles.greeting}>
          Dashboard del rol Cliente.
        </Text>
        <Text style={styles.subtitle}>
          Desde aquí podrás gestionar tus pedidos y seguir las entregas.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={navigateToMisPedidos}
        >
          <Text style={styles.secondaryButtonText}>Mis Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={navigateToPerfil}>
          <Text style={styles.secondaryButtonText}>Mi Perfil</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}