// screens/Pedidos/PedidoDetalle.jsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import useAuthStore from "../../stores/authStore";
import usePedidoStore from "../../stores/pedidoStore";
import PedidoDetalleCliente from "./Cliente/PedidoDetalleCliente";
import PedidoDetalleRepartidor from "./Repartidor/PedidoDetalleRepartidor";

export default function PedidoDetalle({ route }) {
  const { user } = useAuthStore();
  const { fetchPedidoDetalle } = usePedidoStore();
  const { pedido: pedidoParam, id: pedidoId } = route.params || {};
  
  const [pedido, setPedido] = useState(pedidoParam);
  const [loading, setLoading] = useState(!pedidoParam && !!pedidoId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pedidoParam) {
      setPedido(pedidoParam);
      return;
    }

    if (!pedidoId) return;

    const cargarPedido = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPedidoDetalle(pedidoId);
        if (data) {
          // Asegurar que tenga id_pedido
          const pedidoCompleto = {
            ...data,
            id_pedido: data.id_pedido || pedidoId,
          };
          setPedido(pedidoCompleto);
        } else {
          setError("No se pudo cargar el pedido");
        }
      } catch (err) {
        setError("No se pudo cargar el pedido");
        console.error("Error cargando pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarPedido();
  }, [pedidoParam, pedidoId, fetchPedidoDetalle]);

  if (!user || !user.rol) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={{ marginTop: 10 }}>Cargando pedido...</Text>
      </View>
    );
  }

  if (error || !pedido) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error || "No se encontró información del pedido"}</Text>
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
