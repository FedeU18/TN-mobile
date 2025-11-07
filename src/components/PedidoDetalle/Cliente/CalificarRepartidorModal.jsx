import React from "react";
import { View, Modal, TouchableOpacity, Alert, Text } from "react-native";
import styles from "./PedidoDetalleClienteStyles";
import CalificacionRepartidor from "../../Calificacion/CalificacionRepartidor";
import { calificarRepartidor } from "../../../utils/pedidoService";

export default function CalificarRepartidorModal({
  visible,
  onClose,
  detalle,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalCalificacionContainer}>
        <View style={styles.modalCalificacionContent}>
          <CalificacionRepartidor
            onSubmit={async ({ rating, comentario }) => {
              try {
                await calificarRepartidor(
                  detalle.id_pedido,
                  rating,
                  comentario
                );
                Alert.alert("¡Gracias!", "Tu calificación ha sido enviada.");
                onClose();
              } catch (err) {
                console.error("Error al enviar calificación:", err);
                Alert.alert("Error", "No se pudo enviar la calificación.");
              }
            }}
          />
          <TouchableOpacity
            style={styles.botonCancelarCalificacion}
            onPress={onClose}
          >
            <Text style={styles.textoCancelarCalificacion}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
