import React, { useEffect, useState } from "react";
import { Camera } from 'expo-camera';
import { useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  getPedidoDetalleCliente,
  getPedidoConUbicacion,
  calificarRepartidor,
} from "../../../utils/pedidoService";
import { useUbicacionSocket } from "../../../hooks/useUbicacionSocket";
import MapaRepartidor from "../../MapaRepartidor/MapaRepartidor";
import CalificacionRepartidor from "../../Calificacion/CalificacionRepartidor";
import { Alert, Modal, TouchableOpacity } from "react-native";
import styles from "./PedidoDetalleClienteStyles";

export default function PedidoDetalleCliente({ pedido }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

  // Repartidor en tiempo real vía socket
  const ubicacionRepartidor = useUbicacionSocket(
    pedido.id_pedido,
    pedido.estado?.nombre_estado === "En camino"
  );

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        const data = await getPedidoDetalleCliente(pedido.id_pedido);
        setDetalle(data);

        // Si la API devuelve ubicaciones fijas, las guardamos
        if (data.origen_latitud && data.origen_longitud) {
          setOrigen({
            latitud: parseFloat(data.origen_latitud),
            longitud: parseFloat(data.origen_longitud),
          });
        }

        if (data.destino_latitud && data.destino_longitud) {
          setDestino({
            latitud: parseFloat(data.destino_latitud),
            longitud: parseFloat(data.destino_longitud),
          });
        }
      } catch (err) {
        console.error("Error al obtener detalle del pedido:", err);
        setError("No se pudo cargar el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [pedido.id_pedido]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Cargando detalle del pedido...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!detalle) {
    return (
      <View style={styles.center}>
        <Text>No se encontró información del pedido.</Text>
      </View>
    );
  }

  const estadoColor =
    {
      Pendiente: "#ffc107",
      Asignado: "#007AFF",
      "En camino": "#FF9500",
      Entregado: "#28a745",
      Cancelado: "#dc3545",
    }[detalle.estado?.nombre_estado] || "#666";

  console.log("ubicacionRepartidor:", ubicacionRepartidor);
  console.log("origen:", origen);
  console.log("destino:", destino);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannerVisible(false);
    Alert.alert('QR escaneado', 'Entrega confirmada. Código: ' + data);
    // Acá iría la conexión con el backend para confirmar la entrega
    // await confirmarEntregaPedido(detalle.id_pedido, data);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Pedido #{detalle.id_pedido}</Text>
        <Text style={[styles.estado, { color: estadoColor }]}>
          Estado: {detalle.estado?.nombre_estado}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.label}>Repartidor:</Text>{" "}
          {detalle.repartidor
            ? `${detalle.repartidor.nombre} ${detalle.repartidor.apellido}`
            : "No asignado"}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.label}>Dirección de entrega:</Text>{" "}
          {detalle.direccion_destino}
        </Text>
        <Text style={styles.texto}>
          <Text style={styles.label}>Fecha creación:</Text>{" "}
          {new Date(detalle.fecha_creacion).toLocaleString("es-AR")}
        </Text>
      </View>

      {/* Mostrar mapa si hay ubicaciones */}
      {ubicacionRepartidor || origen || destino ? (
        <MapaRepartidor
          repartidorUbicacion={ubicacionRepartidor}
          origenUbicacion={origen}
          destinoUbicacion={destino}
        />
      ) : (
        <View style={styles.noMapa}>
          <Text>Mapa no disponible para este pedido.</Text>
        </View>
      )}

      {/* Estado de seguimiento y escáner QR */}
      {detalle.estado?.nombre_estado === "En camino" && (
        <>
          <View style={styles.seguimiento}>
            <Text style={styles.seguimientoTexto}>
              📍 Seguimiento en tiempo real activo
            </Text>
          </View>
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "#28a745",
                padding: 12,
                borderRadius: 8,
                minWidth: 180,
                alignItems: "center",
              }}
              onPress={() => setScannerVisible(true)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Escanear QR para entrega
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            visible={scannerVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setScannerVisible(false)}
          >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" }}>
              {hasPermission === null ? (
                <Text style={{ color: '#fff' }}>Solicitando permiso para la cámara...</Text>
              ) : hasPermission === false ? (
                <Text style={{ color: '#fff' }}>No se tiene acceso a la cámara</Text>
              ) : (
                <Camera
                  ref={cameraRef}
                  style={{ height: 400, width: 300 }}
                  barCodeScannerSettings={{
                    barCodeTypes: ["qr"],
                  }}
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                />
              )}
              <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: '#fff', padding: 10, borderRadius: 8 }}
                onPress={() => {
                  setScannerVisible(false);
                  setScanned(false);
                }}
              >
                <Text style={{ color: '#007AFF' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
      )}

      {detalle.estado?.nombre_estado === "Entregado" && (
        <View style={styles.seguimiento}>
          <Text style={styles.entregadoTexto}>✅ Pedido entregado</Text>
        </View>
      )}

        {/* Módulo de calificación al repartidor */}
        {detalle.estado?.nombre_estado === "Entregado" && (
          <View>
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: "#007AFF",
                  padding: 12,
                  borderRadius: 8,
                  minWidth: 180,
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(true)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Calificar repartidor
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
                <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 20, width: "90%", elevation: 5 }}>
                  <CalificacionRepartidor
                    onSubmit={async ({ rating, comentario }) => {
                      try {
                        // Enviar la calificación al repartidor
                        await calificarRepartidor(detalle.id_pedido, rating, comentario);
                        Alert.alert(
                          "¡Gracias!", 
                          "Tu calificación ha sido enviada exitosamente."
                        );
                        setModalVisible(false);
                      } catch (err) {
                        console.error('Error al enviar calificación:', err);
                        const errorMsg = err.response?.data?.message || "No se pudo enviar la calificación. Por favor, intenta nuevamente.";
                        Alert.alert("Error", errorMsg);
                      }
                    }}
                  />
                  <TouchableOpacity
                    style={{ marginTop: 10, alignItems: "center" }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={{ color: "#007AFF" }}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
  )}
    </ScrollView>
  );
}