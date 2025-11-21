import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import styles from './ClienteDashboardStyles';
import useAuthStore from '../../stores/authStore';
import COLORS from '../../utils/colors';

export default function ClienteDashboard({ navigation }) {
  const { user, logout } = useAuthStore();

  // Determinar saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días,';
    if (hour < 20) return 'Buenas tardes,';
    return 'Buenas noches,';
  };

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

  const menuItems = [
    {
      label: "Mis Pedidos",
      icon: "history",
      iconFamily: "MaterialIcons",
      onPress: navigateToMisPedidos,
      type: "primary",
      description: "Sigue tus entregas",
    },
    {
      label: "Mi Perfil",
      icon: "account-circle",
      iconFamily: "MaterialIcons",
      onPress: navigateToPerfil,
      type: "secondary",
      description: "Gestiona tu cuenta",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greetingSmall}>{getGreeting()}</Text>
            <Text style={styles.title}>{user?.nombre || 'Usuario'}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>
        Desde aquí podrás gestionar tus pedidos y seguir las entregas.
      </Text>

      {/* Ítems del menú */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={
              item.type === "primary"
                ? styles.primaryMenuItem
                : styles.secondaryMenuItem
            }
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons
                name={item.icon}
                size={28}
                color={item.type === "primary" ? COLORS.white : COLORS.primary}
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text
                style={
                  item.type === "primary"
                    ? styles.menuLabelPrimary
                    : styles.menuLabelSecondary
                }
              >
                {item.label}
              </Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <MaterialIcons
              name="arrow-forward-ios"
              size={18}
              color={item.type === "primary" ? COLORS.white : COLORS.gray[400]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}