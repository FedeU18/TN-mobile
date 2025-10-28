// screens/Pedidos/PedidoDetalle.jsx
import React from "react";
import { View, Text } from "react-native";
import useAuthStore from "../../stores/authStore";
import PedidoDetalleCliente from "./Cliente/PedidoDetalleCliente";
import PedidoDetalleRepartidor from "./Repartidor/PedidoDetalleRepartidor";

export default function PedidoDetalle({ route }) {
  const { user } = useAuthStore();
  const { pedido } = route.params || {};

  if (!user || !user.rol) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se encontró información del pedido</Text>
      </View>
    );
  }

  if (user.rol === "cliente") {
    return <PedidoDetalleCliente pedido={pedido} />;
  }

  if (user.rol === "repartidor") {
    return <PedidoDetalleRepartidor pedido={pedido} />;
  }

  // fallback por si en el futuro hay más roles
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Rol no soportado</Text>
    </View>
  );
}
