import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";
import ClienteDashboard from "../pages/ClienteDashboard/ClienteDashboard";
import RepartidorDashboard from "../pages/RepartidorDashboard/RepartidorDashboard";
import Perfil from "../pages/Perfil/Perfil";
import PedidosDisponibles from "../components/PedidosDisponibles/PedidosDisponibles";
import MisPedidos from "../components/MisPedidos/MisPedidos";
import HistorialEntregas from "../components/HistorialEntregas/HistorialEntregas";
import PedidoDetalle from "../components/PedidoDetalle/PedidoDetalle";
import Footer from "../components/Footer/Footer";
import useAuthStore from "../stores/authStore";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useAuthStore();
  const [currentRoute, setCurrentRoute] = useState("Dashboard");

  const roleScreenMap = {
    cliente: ClienteDashboard,
    repartidor: RepartidorDashboard,
    // admin: AdminDashboard,
  };

  const DefaultScreen =
    roleScreenMap[user?.rol?.toLowerCase()] || ClienteDashboard;

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        screenListeners={{
          state: (e) => {
            const routeName = e.data.state?.routes[e.data.state.index]?.name;
            if (routeName) {
              setCurrentRoute(routeName);
            }
          },
        }}
      >
        <Stack.Screen name="Dashboard" component={DefaultScreen} />
        <Stack.Screen
          name="PedidosDisponibles"
          component={PedidosDisponibles}
        />
        <Stack.Screen name="MisPedidos" component={MisPedidos} />
        <Stack.Screen name="HistorialEntregas" component={HistorialEntregas} />
        <Stack.Screen name="PedidoDetalle" component={PedidoDetalle} />
        <Stack.Screen name="Perfil" component={Perfil} />
      </Stack.Navigator>
      <Footer currentRoute={currentRoute} />
    </View>
  );
};

export default AppNavigator;
