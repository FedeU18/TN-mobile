import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';
import {styles} from "./ConfirmacionModalStyles";

const ConfirmacionModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>¡Gracias por tu calificación!</Text>
          <Text style={styles.text}>Tu opinión ayuda a mejorar el servicio.</Text>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmacionModal;
