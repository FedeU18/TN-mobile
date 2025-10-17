import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './AdminDashboardStyles';
import useAuthStore from '../../stores/authStore';

export default function AdminDashboard({ navigation }) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // El App.jsx manejará automáticamente el cambio de navegación cuando el token se limpie
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>¡Bienvenido {user?.nombre || 'Usuario'}!</Text>
        <Text style={styles.greeting}>
          Dashboard del rol Admin.
        </Text>
        <Text style={styles.subtitle}>
          Desde aquí podrás administrar todo el sistema.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Gestionar Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Reportes</Text>
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