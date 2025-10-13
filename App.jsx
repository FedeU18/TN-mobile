import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Text } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
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
import PedidosDisponibles from './src/components/PedidosDisponibles/PedidosDisponibles';
import MisPedidos from './src/components/MisPedidos/MisPedidos';
import PedidoDetalle from './src/components/PedidoDetalle/PedidoDetalle';
import MisPedidosCliente from './src/components/PedidosCliente/PedidosCliente';
import PedidoDetalleCliente from './src/components/PedidoClienteDetalle/PedidoClienteDetalle';

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

// Componente que maneja la navegación automática al dashboard correcto
function AuthenticatedApp({ navigation }) {
  const { user } = useAuthStore();
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (user && !hasNavigated) {
      const roleScreenMap = {
        'cliente': 'ClienteDashboard',
        'repartidor': 'RepartidorDashboard',
        'admin': 'AdminDashboard'
      };

      const targetScreen = roleScreenMap[user.rol?.toLowerCase()] || 'ClienteDashboard';

      setHasNavigated(true);

      // Pequeño delay para asegurar que la navegación funcione
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: targetScreen }],
          })
        );
      }, 50);
    }
  }, [user, navigation, hasNavigated]);

  return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text>Redirigiendo a tu panel...</Text>
    </View>
  );
}

export default function App() {
  const { token, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

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
        screenOptions={{
          headerShown: false,
        }}
      >
        {!token || !user ? (
          // Pantallas públicas (no autenticado)
          <>
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
          </>
        ) : (
          // Pantallas privadas (autenticado)
          <>
            <Stack.Screen name="AuthRedirect" component={AuthenticatedApp} />
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
            <Stack.Screen
              name="PedidosDisponibles"
              component={PedidosDisponibles}
            />
            <Stack.Screen name="MisPedidos" component={MisPedidos} />
            <Stack.Screen name="PedidoDetalle" component={PedidoDetalle} />
            <Stack.Screen
              name="MisPedidosCliente"
              component={MisPedidosCliente}
              options={{ title: 'Mis Pedidos' }}
            />
            <Stack.Screen
              name="PedidoDetalleCliente"
              component={PedidoDetalleCliente}
              options={{ title: 'Detalle del Pedido' }}
            />
          </>
        )}
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
