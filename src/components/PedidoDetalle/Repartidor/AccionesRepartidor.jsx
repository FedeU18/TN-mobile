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
  return (
    <>
      <TouchableOpacity
        style={[
          styles.boton,
          { backgroundColor: estaRastreando ? "#dc3545" : "#007AFF" },
        ]}
        onPress={manejarSeguimiento}
      >
        <Text style={styles.botonTexto}>
          {estaRastreando ? "Detener seguimiento" : "Iniciar seguimiento"}
        </Text>
      </TouchableOpacity>

      <View style={styles.botonesEstado}>
        {detalle.estado?.nombre_estado === "Asignado" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#FF9500" }]}
            onPress={() => manejarCambioEstado("En camino")}
          >
            <Text style={styles.botonTexto}>Iniciar trayecto</Text>
          </TouchableOpacity>
        )}

        {detalle.estado?.nombre_estado === "En camino" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#007AFF" }]}
            onPress={() => setMostrarQR(true)}
          >
            <Text style={styles.botonTexto}>Mostrar QR del pedido</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
