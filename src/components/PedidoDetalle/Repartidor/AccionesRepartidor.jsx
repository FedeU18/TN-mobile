import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "./Styles";

export default function AccionesRepartidor({
  detalle,
  estaRastreando,
  manejarSeguimiento,
  manejarCambioEstado,
  setMostrarQR,
}) {
  // No mostrar botón de seguimiento si el pedido está cancelado o entregado
  const mostrarBotonSeguimiento =
    detalle.estado?.nombre_estado !== "Cancelado" &&
    detalle.estado?.nombre_estado !== "Entregado";

  return (
    <>
      <View style={styles.botonesFila}>
        {/* SEGUIMIENTO */}
        {mostrarBotonSeguimiento && (
          <TouchableOpacity
            style={[
              styles.botonEstado,
              { backgroundColor: estaRastreando ? "#dc3545" : "#007AFF" },
            ]}
            onPress={manejarSeguimiento}
          >
            <Text style={styles.botonTexto}>
              {estaRastreando ? "Detener" : "Iniciar"} GPS
            </Text>
          </TouchableOpacity>
        )}

        {/* BOTONES DE ESTADO */}
        {detalle.estado?.nombre_estado === "Asignado" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#FF9500" }]}
            onPress={() => manejarCambioEstado("En camino")}
          >
            <Text style={styles.botonTexto}>Iniciar entrega</Text>
          </TouchableOpacity>
        )}

        {detalle.estado?.nombre_estado === "En camino" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#007AFF" }]}
            onPress={() => setMostrarQR(true)}
          >
            <Text style={styles.botonTexto}>Mostrar QR</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
