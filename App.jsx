import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "./src/stores/authStore";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppLayout from "./src/components/layout/AppLayout";

// 🚫 Eliminado: expo-notifications y useRegistrarTokenPush
// import * as Notifications from "expo-notifications";
// import useRegistrarTokenPush from "./src/hooks/useRegistrarTokenPush";

export default function App() {
  const { token, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useRef();

  // Simula carga inicial (por ejemplo, AsyncStorage o splash)
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // 🔔 Simulación de recepción de notificaciones
  // (podés reemplazar esto por llamadas reales desde el backend si querés)
  // useEffect(() => {
  //   // Ejemplo: mostrar un mensaje simulado al iniciar sesión
  //   if (user) {
  //     const timer = setTimeout(() => {
  //       Alert.alert(
  //         "📦 Pedido confirmado",
  //         "Tu pedido #123 fue confirmado correctamente 🚴‍♂️"
  //       );
  //     }, 3000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [user]);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando aplicación...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <AppLayout>
        {token && user ? <AppNavigator /> : <AuthNavigator />}
      </AppLayout>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});
