import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePedidoDetalleCliente } from "../../../hooks/usePedidoDetalleCliente";
import { useUbicacionSocket } from "../../../hooks/useUbicacionSocket";
import PedidoInfo from "./PedidoInfo";
import MapaPedido from "./MapaPedido";
import ScannerQR from "./ScannerQR";
import CalificarRepartidorModal from "./CalificarRepartidorModal";
import styles from "./PedidoDetalleClienteStyles";

export default function PedidoDetalleCliente({ pedido }) {
  const insets = useSafeAreaInsets();
  const { detalle, loading, error, origen, destino, setDetalle } =
    usePedidoDetalleCliente(pedido.id_pedido);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const ubicacionRepartidor = useUbicacionSocket(
    pedido.id_pedido,
    detalle?.estado?.nombre_estado === "En camino"
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando detalle del pedido...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  if (!detalle)
    return (
      <View style={styles.center}>
        <Text>No se encontró información del pedido.</Text>
      </View>
    );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}
    >
      <MapaPedido
        repartidorUbicacion={ubicacionRepartidor}
        origen={origen}
        destino={destino}
        estadoPedido={detalle?.estado?.nombre_estado} // ← AGREGADO
      />

      {detalle.estado?.nombre_estado === "En camino" && (
        <>
          <View style={styles.seguimiento}>
            <Text style={styles.seguimientoTexto}>
              📍 Seguimiento en tiempo real activo
            </Text>
          </View>
          <View style={styles.botonContainer}>
            <TouchableOpacity
              style={styles.botonEscanear}
              onPress={() => setScannerVisible(true)}
            >
              <Text style={styles.botonTexto}>Escanear QR para entrega</Text>
            </TouchableOpacity>
          </View>
          <ScannerQR
            visible={scannerVisible}
            detalle={detalle}
            onClose={() => setScannerVisible(false)}
            onUpdateDetalle={setDetalle} // si querés actualizar estado después de escaneo
          />
        </>
      )}

      {detalle.estado?.nombre_estado === "Entregado" && (
        <>
          <View style={styles.seguimiento}>
            <Text style={styles.entregadoTexto}>Pedido entregado</Text>
          </View>
          <View style={styles.botonContainer}>
            <TouchableOpacity
              style={styles.botonCalificar}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.botonTexto}>Calificar repartidor</Text>
            </TouchableOpacity>
          </View>
          <CalificarRepartidorModal
            visible={modalVisible}
            detalle={detalle}
            onClose={() => setModalVisible(false)}
          />
        </>
      )}
    </ScrollView>
  );
}
