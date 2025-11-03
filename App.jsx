import React, { useEffect, useState, useRef } from "react";
import useRegistrarTokenPush from "./src/hooks/useRegistrarTokenPush";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import useAuthStore from "./src/stores/authStore";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppLayout from "./src/components/layout/AppLayout";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  useRegistrarTokenPush();
  const { token, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);
  const navigationRef = useRef();
  const notificationListener = useRef();
  const responseListener = useRef();

  // Simula carga inicial (por AsyncStorage)
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Configurar listeners de notificaciones
  useEffect(() => {
    // Listener para notificaciones recibidas mientras la app está abierta
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log("📬 Notificación recibida:", notification);
      
    });

    // Listener para cuando el usuario toca una notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("👆 Usuario tocó la notificación:", response);
      
      // Obtener datos de la notificación
      const data = response.notification.request.content.data;
      
      if (data.pedidoId && navigationRef.current) {
        // Navegar a la pantalla de detalle del pedido
        navigationRef.current.navigate("PedidoDetalle", { 
          pedidoId: data.pedidoId 
        });
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

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
