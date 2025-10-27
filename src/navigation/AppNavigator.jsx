import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ClienteDashboard from "../pages/ClienteDashboard/ClienteDashboard";
import RepartidorDashboard from "../pages/RepartidorDashboard/RepartidorDashboard";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import PedidosDisponibles from "../components/PedidosDisponibles/PedidosDisponibles";
import MisPedidos from "../components/MisPedidos/MisPedidos";
import PedidoDetalle from "../components/PedidoDetalle/PedidoDetalle";
import useAuthStore from "../stores/authStore";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useAuthStore();

  const roleScreenMap = {
    cliente: ClienteDashboard,
    repartidor: RepartidorDashboard,
    admin: AdminDashboard,
  };

  const DefaultScreen =
    roleScreenMap[user?.rol?.toLowerCase()] || ClienteDashboard;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DefaultScreen} />
      <Stack.Screen name="PedidosDisponibles" component={PedidosDisponibles} />
      <Stack.Screen name="MisPedidos" component={MisPedidos} />
      <Stack.Screen name="PedidoDetalle" component={PedidoDetalle} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
