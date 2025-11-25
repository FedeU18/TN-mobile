import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAuthStore from "../../../stores/authStore";
import usePedidoDetalle from "../../../hooks/usePedidoDetalle";
import MapaRepartidor from "../../Mapa/Repartidor/MapaRepartidor";
import EstadoPedido from "./EstadoPedido";
import AccionesRepartidor from "./AccionesRepartidor";
import ModalQR from "./ModalQR";
import PedidoInfo from "./PedidoInfo";
import styles from "./Styles";

export default function PedidoDetalleRepartidor({ pedido }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const {
    detalle,
    loading,
    error,
    origen,
    destino,
    mostrarQR,
    setMostrarQR,
    ultimaUbicacion,
    estaRastreando,
    manejarCambioEstado,
    manejarSeguimiento,
  } = usePedidoDetalle(pedido.id_pedido);

  // Determinar si el pedido está asignado (tiene un repartidor)
  // Si viene sin id_repartidor es un pedido disponible
  const pedidoAsignado = detalle?.id_repartidor || detalle?.repartidor_id;
  // Cerrar modal QR automáticamente cuando el cliente completa la entrega
  useEffect(() => {
    if (detalle?.estado?.nombre_estado === "Entregado") {
      setMostrarQR(false);
    }
  }, [detalle?.estado?.nombre_estado]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando detalle del pedido...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  if (!detalle)
    return (
      <View style={styles.center}>
        <Text>No se encontró información del pedido.</Text>
      </View>
    );
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <PedidoInfo detalle={detalle} />
      {detalle.estado?.nombre_estado !== "Cancelado" &&
        detalle.estado?.nombre_estado !== "Entregado" && (
          <MapaRepartidor
            repartidorUbicacion={ultimaUbicacion}
            origenUbicacion={origen}
            destinoUbicacion={destino}
            estadoPedido={detalle.estado.nombre_estado}
          />
        )}
      {pedidoAsignado && (
        <AccionesRepartidor
          detalle={detalle}
          estaRastreando={estaRastreando}
          manejarSeguimiento={manejarSeguimiento}
          manejarCambioEstado={manejarCambioEstado}
          setMostrarQR={setMostrarQR}
        />
      )}
      <ModalQR
        visible={mostrarQR}
        onClose={() => setMostrarQR(false)}
        qr={detalle.qr_codigo}
      />
    </ScrollView>
  );
}
