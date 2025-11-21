import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import usePedidoStore from "../../stores/pedidoStore";
import useAuthStore from "../../stores/authStore";
import styles from "./PedidosDisponiblesStyles";

const PedidoItem = ({ pedido, onTomarPedido, onVerDetalle, loading }) => {
  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleTomarPedido = () => {
    Alert.alert(
      "Confirmar Pedido",
      `¿Deseás tomar el pedido #${pedido.id_pedido}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Tomar Pedido",
          onPress: () => onTomarPedido(pedido.id_pedido),
          style: "default",
        },
      ]
    );
  };

  return (
    <View style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>Pedido #{pedido.id_pedido}</Text>
        <Text style={styles.horaEstimada}>
          {formatearHora(pedido.fecha_creacion)}
        </Text>
      </View>

      <View style={styles.pedidoInfo}>
        <Text style={styles.cliente}>
          Cliente: {pedido.cliente?.nombre || "Sin Nombre"}{" "}
          {pedido.cliente?.apellido || ""}
        </Text>
        <Text style={styles.direccion}>
          Destino: {pedido.direccion_destino}
        </Text>
        {pedido.direccion_origen && (
          <Text style={styles.direccion}>
            Origen: {pedido.direccion_origen}
          </Text>
        )}
      </View>

      <View style={styles.botoneesContainer}>
        <TouchableOpacity
          style={styles.verDetalleButton}
          onPress={() => onVerDetalle(pedido.id_pedido)}
        >
          <Text style={styles.verDetalleButtonText}>Ver Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tomarButton, loading && styles.buttonDisabled]}
          onPress={handleTomarPedido}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.tomarButtonText}>Tomar Pedido</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function PedidosDisponibles({ navigation }) {
  const {
    pedidosDisponibles,
    loading,
    error,
    fetchPedidosDisponibles,
    tomarPedido,
    clearError,
  } = usePedidoStore();

  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [pedidoEnCarga, setPedidoEnCarga] = useState(null);

  useEffect(() => {
    fetchPedidosDisponibles();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPedidosDisponibles();
    setRefreshing(false);
  };

  const handleTomarPedido = async (pedidoId) => {
    try {
      setPedidoEnCarga(pedidoId);
      await tomarPedido(pedidoId);
      Alert.alert("Éxito", `Has tomado el pedido #${pedidoId}`, [
        {
          text: "Ver mis pedidos",
          onPress: () => navigation.navigate("MisPedidos"),
        },
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar el pedido. Intenta nuevamente.");
    } finally {
      setPedidoEnCarga(null);
    }
  };

  const handleVerDetalle = (pedidoId) => {
    navigation.navigate("PedidoDetalle", { id: pedidoId });
  };

  const renderPedido = ({ item }) => (
    <PedidoItem
      pedido={item}
      onTomarPedido={handleTomarPedido}
      onVerDetalle={handleVerDetalle}
      loading={pedidoEnCarga === item.id_pedido}
    />
  );

  if (loading && pedidosDisponibles.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text style={styles.loadingText}>Cargando pedidos disponibles...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos Disponibles</Text>
        <Text style={styles.subtitle}>Selecciona un pedido para tomarlo</Text>
      </View>

      <FlatList
        data={pedidosDisponibles}
        renderItem={renderPedido}
        keyExtractor={(item) => item.id_pedido.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007aff"]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No hay pedidos disponibles en este momento.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
