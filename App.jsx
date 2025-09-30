import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useAuthStore from './src/stores/authStore';
import Header from './src/components/Header/Header';
import Footer from './src/components/Footer/Footer';
import Home from './src/pages/Home/Home';
import Login from './src/pages/Login/Login';
import Register from './src/pages/Register/Register';
import ForgotPassword from './src/pages/ForgotPassword/ForgotPassword';
import ResetPassword from './src/pages/ResetPassword/ResetPassword';
import ClienteDashboard from './src/pages/ClienteDashboard/ClienteDashboard';
import RepartidorDashboard from './src/pages/RepartidorDashboard/RepartidorDashboard';
import AdminDashboard from './src/pages/AdminDashboard/AdminDashboard';

const Stack = createStackNavigator();

function AppLayout({ children }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <View style={styles.content}>
        {children}
      </View>
      <Footer />
    </View>
  );
}

export default function App() {
  const { token, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  
  // Determinar la pantalla inicial basada en el token
  const getInitialRouteName = () => {
    if (token && user) {
      // Redirigir al dashboard
      const roleScreenMap = {
        'cliente': 'ClienteDashboard',
        'repartidor': 'RepartidorDashboard', 
        'admin': 'AdminDashboard'
      };
      return roleScreenMap[user.rol] || 'Home';
    }
    return 'Home';
  };

  // Delay para que AsyncStorage termine de cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <AppLayout>
              <Home {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => (
            <AppLayout>
              <Login {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(props) => (
            <AppLayout>
              <Register {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword">
          {(props) => (
            <AppLayout>
              <ForgotPassword {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ResetPassword">
          {(props) => (
            <AppLayout>
              <ResetPassword {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ClienteDashboard">
          {(props) => (
            <AppLayout>
              <ClienteDashboard {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="RepartidorDashboard">
          {(props) => (
            <AppLayout>
              <RepartidorDashboard {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="AdminDashboard">
          {(props) => (
            <AppLayout>
              <AdminDashboard {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
