import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import styles from "./RepartidorDashboardStyles";
import useAuthStore from "../../stores/authStore";
import useWeather from "../../hooks/useWeather";
import WeatherCard from "../../components/WeatherCard/WeatherCard";

export default function RepartidorDashboard({ navigation }) {
  const { user, logout } = useAuthStore();
  const { weather, loading, error } = useWeather();

  const handleLogout = () => logout();

  const menuItems = [
    {
      label: "Pedidos Disponibles",
      onPress: () => navigation.navigate("PedidosDisponibles"),
      type: "primary",
    },
    {
      label: "Mis Pedidos",
      onPress: () =>
        navigation.navigate("MisPedidos", { userRole: "repartidor" }),
    },
    { label: "Historial", onPress: () => console.log("Ver historial") },
    { label: "Mi Perfil", onPress: () => console.log("Ver perfil") },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>
          ¡Bienvenido {user?.nombre || "Repartidor"}!
        </Text>
        <Text style={styles.greeting}>Panel de gestión de entregas.</Text>
        <Text style={styles.subtitle}>
          Desde aquí podrás ver tus pedidos y rutas activas.
        </Text>
      </View>

      {/* --- CLIMA --- */}
      <View style={styles.weatherContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#007aff" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : null}
      </View>

      {/* --- MENÚ --- */}
      <View style={styles.buttonContainer}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={
              item.type === "primary"
                ? styles.primaryButton
                : styles.secondaryButton
            }
            onPress={item.onPress}
          >
            <Text
              style={
                item.type === "primary"
                  ? styles.primaryButtonText
                  : styles.secondaryButtonText
              }
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- LOGOUT --- */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
