import React from "react";
import { Text } from "react-native";
import styles from "./Styles";

export default function EstadoPedido({ nombre }) {
  const color =
    {
      Pendiente: "#ffc107",
      Asignado: "#007AFF",
      "En camino": "#FF9500",
      Entregado: "#28a745",
      Cancelado: "#dc3545",
    }[nombre] || "#666";

  return <Text style={[styles.estado, { color }]}>Estado: {nombre}</Text>;
}
