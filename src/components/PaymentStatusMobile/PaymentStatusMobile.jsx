import React from "react";
import { View, Text } from "react-native";
import styles from "./PaymentStatusMobile.styles";

export default function PaymentStatusMobile({ estado_pago, monto_pedido, fecha_pago }) {
  // Mapeo de estados a colores y mensajes
  const estadoMap = {
    pendiente: {
      label: "Pendiente de pago",
      color: "#fbbf24",
      descripcion: "El cliente aún no ha pagado este pedido",
    },
    pendiente_pago: {
      label: "Pago en proceso",
      color: "#60a5fa",
      descripcion: "El pago está siendo procesado",
    },
    pagado: {
      label: "Pagado",
      color: "#34d399",
      descripcion: "El pago fue confirmado",
    },
    fallido: {
      label: "Pago fallido",
      color: "#f87171",
      descripcion: "El pago fue rechazado, intenta nuevamente",
    },
    reembolsado: {
      label: "Reembolsado",
      color: "#9ca3af",
      descripcion: "El pago fue reembolsado",
    },
  };

  const estado = estadoMap[estado_pago] || estadoMap.pendiente;

  // Solo mostrar si el estado de pago es pendiente, fallido o reembolsado
  if (!["no pagado", "pendiente", "pendiente_pago", "fallido", "reembolsado"].includes(estado_pago)) {
    return null;
  }

  // Para "No pagado", mostrar solo el título (versión compacta)
  if (estado_pago === "no pagado" || estado_pago === "pendiente") {
    return (
      <View style={[styles.container, styles.compact]}>
        <Text style={[styles.title, { color: "#92400e" }]}>{estado.label}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderLeftColor: estado.color }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: estado.color }]}>{estado.label}</Text>
      </View>

      <Text style={styles.description}>{estado.descripcion}</Text>

      {monto_pedido && (
        <View style={styles.monto}>
          <Text style={styles.label}>Monto:</Text>
          <Text style={[styles.value, { color: estado.color }]}>
            ${parseFloat(monto_pedido).toFixed(2)}
          </Text>
        </View>
      )}

      {fecha_pago && estado_pago === "pagado" && (
        <View style={styles.fecha}>
          <Text style={styles.label}>Pagado el:</Text>
          <Text style={styles.value}>
            {new Date(fecha_pago).toLocaleDateString("es-AR")}
          </Text>
        </View>
      )}
    </View>
  );
}
