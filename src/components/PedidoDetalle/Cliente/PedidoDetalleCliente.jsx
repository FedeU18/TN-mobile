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
import PaymentButtonMobile from "../../PaymentButtonMobile/PaymentButtonMobile";
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
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <PedidoInfo detalle={detalle} />

      {/* Botón de pago si el pedido está en "No pagado" */}
      {detalle?.estado?.nombre_estado === "No pagado" && (
        <View style={styles.botonContainer}>
          <PaymentButtonMobile
            id_pedido={detalle.id_pedido}
            estado_pago={detalle.estado_pago}
            estado_pedido={detalle.estado?.nombre_estado}
            monto={detalle.monto_pedido}
            onPaymentSuccess={() => {
              // Recargar detalle después del pago
              setTimeout(() => {
                // Aquí puedes llamar a fetch de detalle si necesitas
              }, 2000);
            }}
          />
        </View>
      )}

      <MapaPedido
        repartidorUbicacion={ubicacionRepartidor}
        origen={origen}
        destino={destino}
        estadoPedido={detalle?.estado?.nombre_estado}
      />

      {detalle.estado?.nombre_estado === "En camino" && (
        <>
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
          <View style={styles.botonContainer}>
            <TouchableOpacity
              style={[
                styles.botonCalificar,
                detalle.calificacion && styles.botonCalificadoDeshabilitado,
              ]}
              onPress={() => !detalle.calificacion && setModalVisible(true)}
              disabled={!!detalle.calificacion}
            >
              <Text style={styles.botonTexto}>
                {detalle.calificacion
                  ? "Pedido ya calificado"
                  : "Calificar repartidor"}
              </Text>
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
