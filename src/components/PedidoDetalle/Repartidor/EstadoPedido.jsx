import React from "react";
import { Text } from "react-native";
import COLORS from "../../../utils/colors";
import styles from "./Styles";

export default function EstadoPedido({ nombre }) {
  const color =
    {
      Pendiente: COLORS.status.pending,
      Asignado: COLORS.status.assigned,
      "En camino": COLORS.status.inTransit,
      Entregado: COLORS.status.delivered,
      Cancelado: COLORS.status.cancelled,
    }[nombre] || COLORS.info;

  return <Text style={[styles.estado, { color }]}>Estado: {nombre}</Text>;
}
