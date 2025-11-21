import React from "react";
import { View, Text } from "react-native";
import styles from "./PedidoDetalleClienteStyles";

export default function PedidoInfo({ detalle }) {
  const estadoColor =
    {
      Pendiente: "#ffc107",
      Asignado: "#007AFF",
      "En camino": "#FF9500",
      Entregado: "#28a745",
      Cancelado: "#dc3545",
    }[detalle.estado?.nombre_estado] || "#666";

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Pedido #{detalle.id_pedido}</Text>
      <Text style={[styles.estado, { color: estadoColor }]}>
        Estado: {detalle.estado?.nombre_estado}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.label}>Repartidor:</Text>{" "}
        {detalle.repartidor
          ? `${detalle.repartidor.nombre} ${detalle.repartidor.apellido}`
          : "No asignado"}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.label}>Dirección de entrega:</Text>{" "}
        {detalle.direccion_destino}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.label}>Fecha creación:</Text>{" "}
        {new Date(detalle.fecha_creacion).toLocaleString("es-AR")}
      </Text>
      {detalle.estado?.nombre_estado === "Entregado" && detalle.fecha_entrega && (
        <Text style={styles.texto}>
          <Text style={styles.label}>Fecha entrega:</Text>{" "}
          {new Date(detalle.fecha_entrega).toLocaleString("es-AR")}
        </Text>
      )}
    </View>
  );
}
