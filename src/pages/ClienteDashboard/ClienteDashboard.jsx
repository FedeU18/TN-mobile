import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './ClienteDashboardStyles';
import useAuthStore from '../../stores/authStore';

export default function ClienteDashboard({ navigation }) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>¡Bienvenido {user?.nombre || 'Usuario'}!</Text>
        <Text style={styles.greeting}>
          Dashboard del rol Cliente.
        </Text>
        <Text style={styles.subtitle}>
          Desde aquí podrás realizar y gestionar tus pedidos.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Hacer Pedido</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Mis Pedidos</Text>
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