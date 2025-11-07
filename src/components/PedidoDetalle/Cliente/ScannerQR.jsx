import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Alert } from "react-native";
import { CameraView } from "expo-camera";
import styles from "./PedidoDetalleClienteStyles";
import { validarQREntrega } from "../../../utils/pedidoService";

export default function ScannerQR({ detalle, visible, onClose }) {
  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      const url = new URL(data);
      const token = url.searchParams.get("token");
      if (!token) throw new Error("Token inválido");

      await validarQREntrega(detalle.id_pedido, token);
      onClose();
      Alert.alert(
        "✅ Entrega confirmada",
        `Pedido #${detalle.id_pedido} entregado`
      );
    } catch (error) {
      console.error("Error al validar QR:", error);
      setScanned(false);
      Alert.alert(
        "Error al validar QR",
        "QR inválido o expirado. Por favor, verifica con el repartidor."
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalScanner}>
        <View style={styles.scannerHeader}>
          <Text style={styles.scannerTitulo}>Escanear código QR</Text>
          <Text style={styles.scannerSubtitulo}>
            Apunta la cámara al código QR del repartidor
          </Text>
        </View>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.cameraView}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.qrMarcoContainer}>
              <View style={styles.qrMarco} />
            </View>
          </CameraView>
        </View>
        <View style={styles.scannerFooter}>
          <TouchableOpacity style={styles.botonCancelar} onPress={onClose}>
            <Text style={styles.botonCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
