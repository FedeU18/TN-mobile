import React, { useEffect, useState } from "react";
import useRegistrarTokenPush from "./src/hooks/useRegistrarTokenPush";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import useAuthStore from "./src/stores/authStore";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppLayout from "./src/components/layout/AppLayout";

export default function App() {
  useRegistrarTokenPush();
  const { token, user } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  // Simula carga inicial (por AsyncStorage)
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
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
    <NavigationContainer>
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
