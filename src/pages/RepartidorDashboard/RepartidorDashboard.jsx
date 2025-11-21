import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ScrollView,
  Animated 
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import styles from "./RepartidorDashboardStyles";
import useAuthStore from "../../stores/authStore";
import usePedidoStore from "../../stores/pedidoStore";
import useWeather from "../../hooks/useWeather";
import WeatherCard from "../../components/WeatherCard/WeatherCard";
import COLORS from "../../utils/colors";

export default function RepartidorDashboard({ navigation }) {
  const { user, logout } = useAuthStore();
  const { misPedidos, pedidosDisponibles, fetchMisPedidos, fetchPedidosDisponibles, loading } = usePedidoStore();
  const { weather, loading: weatherLoading, error: weatherError } = useWeather();
  const [animatedValue] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Cargar datos iniciales
    fetchMisPedidos();
    fetchPedidosDisponibles();
    
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Determinar saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días,';
    if (hour < 20) return 'Buenas tardes,';
    return 'Buenas noches,';
  };

  // Contar pedidos en ruta
  const enRuta = misPedidos?.filter(p => 
    p.estado?.nombre_estado?.toLowerCase() === 'en camino' || 
    p.estado?.nombre_estado?.toLowerCase() === 'asignado'
  ).length || 0;

  const disponibles = pedidosDisponibles?.length || 0;

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
      label: "Pedidos Disponibles",
      icon: "assignment",
      onPress: () => navigation.navigate("PedidosDisponibles"),
      type: "primary",
      description: "Aceptar nuevos repartos",
    },
    {
      label: "Mis Pedidos",
      icon: "local-shipping",
      onPress: () =>
        navigation.navigate("MisPedidos", { userRole: "repartidor" }),
      type: "secondary",
      description: "Tus entregas activas",
    },
    {
      label: "Mi Perfil",
      icon: "person",
      onPress: () => navigation.navigate("Perfil"),
      type: "secondary",
      description: "Gestiona tu cuenta",
    },
  ];

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER GRADIENT */}
      <View style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.greetingSmall}>{getGreeting()}</Text>
            <Text style={styles.title}>{user?.nombre || "Repartidor"}</Text>
          </View>
        </View>
      </View>

      {/* QUICK STATS */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: COLORS.warningLight }]}>
          <MaterialIcons name="assignment" size={24} color={COLORS.warning} />
          <Text style={styles.statLabel}>Disponibles</Text>
          <Text style={styles.statValue}>{loading ? '...' : disponibles}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: COLORS.primaryLight }]}>
          <MaterialIcons name="directions-run" size={24} color={COLORS.primary} />
          <Text style={styles.statLabel}>En Ruta</Text>
          <Text style={styles.statValue}>{loading ? '...' : enRuta}</Text>
        </View>
      </View>

      {/* Clima */}
      <Text style={styles.sectionTitle}> </Text>
      <View style={styles.weatherContainer}>
        {weatherLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Cargando clima...</Text>
          </View>
        ) : weatherError ? (
          <Text style={styles.errorText}>{weatherError}</Text>
        ) : weather ? (
          <WeatherCard weather={weather} />
        ) : null}
      </View>

      {/* Menú */}
      <Text style={styles.sectionTitle}></Text>

      {/* Ítems del menú */}
      <Animated.View style={[styles.menuContainer, { opacity, transform: [{ translateY }] }]}>
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
      </Animated.View>

      <View style={styles.footerSpace} />
    </ScrollView>
  );
}
