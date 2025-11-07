import React from "react";
import { View, Text, Image, TouchableOpacity, Modal } from "react-native";
import styles from "./Styles";

export default function ModalQR({ visible, onClose, qr }) {
  const uri =
    qr && (qr.startsWith("data:image") ? qr : `data:image/png;base64,${qr}`);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mostrale este código al cliente</Text>

          {uri ? (
            <Image
              source={{ uri }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : (
            <Text>No hay QR disponible</Text>
          )}

          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.boton,
              { backgroundColor: "#007AFF", marginTop: 20 },
            ]}
          >
            <Text style={styles.botonTexto}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
