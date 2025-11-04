import React, { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import io from "socket.io-client";
import {
  getPedidoDetalleCliente,
  calificarRepartidor,
  validarQREntrega,
} from "../../../utils/pedidoService";
import { useUbicacionSocket } from "../../../hooks/useUbicacionSocket";
import MapaRepartidor from "../../MapaRepartidor/MapaRepartidor";
import CalificacionRepartidor from "../../Calificacion/CalificacionRepartidor";
import styles from "./PedidoDetalleClienteStyles";

export default function PedidoDetalleCliente({ pedido }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Ubicación del repartidor (socket separado)
  const ubicacionRepartidor = useUbicacionSocket(
    pedido.id_pedido,
    pedido.estado?.nombre_estado === "En camino"
  );

  // 🧩 Escuchar cambios de estado en tiempo real
  useEffect(() => {
    const socket = io(
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
      { transports: ["websocket"] }
    );
    socket.on("connect", () => {
      console.log("✅ Conectado al servidor socket con ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Desconectado del servidor:", reason);
    });
    socket.emit("joinPedido", pedido.id_pedido);
    console.log("🛰️ Cliente unido al room pedido_", pedido.id_pedido);

    socket.on("estadoActualizado", (data) => {
      if (data.pedidoId === Number(pedido.id_pedido)) {
        console.log("📦 Cliente recibió actualización de estado:", data);

        setDetalle((prev) => ({
          ...prev,
          estado: { nombre_estado: data.nuevoEstado },
        }));

        // Aviso visual simple
        Alert.alert(
          "🔔 Pedido actualizado",
          `Nuevo estado: ${data.nuevoEstado}`
        );
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión socket (cliente):", err.message);
    });

    return () => {
      socket.emit("leavePedido", pedido.id_pedido);
      socket.off("estadoActualizado");
      socket.disconnect();
      console.log("🛰️ Cliente desconectado del pedido", pedido.id_pedido);
    };
  }, [pedido.id_pedido]);

  // 🔹 Fetch inicial
  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        const data = await getPedidoDetalleCliente(pedido.id_pedido);
        setDetalle(data);

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

  // 🔹 Escanear QR para confirmar entrega
  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const url = new URL(data);
      const token = url.searchParams.get("token");

      if (!token) {
        Alert.alert("❌ Error", "El código QR no contiene un token válido");
        setScanned(false);
        return;
      }

      const resultado = await validarQREntrega(detalle.id_pedido, token);
      setScannerVisible(false);

      Alert.alert(
        "✅ Entrega confirmada",
        `Pedido #${detalle.id_pedido} entregado`,
        [
          {
            text: "OK",
            onPress: () => {
              setDetalle((prev) => ({
                ...prev,
                estado: { nombre_estado: "Entregado" },
              }));
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error al validar QR:", error);
      setScanned(false);

      const errorMsg =
        error.response?.data?.message ||
        "QR inválido o expirado. Por favor, verifica con el repartidor.";

      Alert.alert("Error al validar QR", errorMsg, [
        { text: "Reintentar", onPress: () => setScanned(false) },
        {
          text: "Cancelar",
          onPress: () => setScannerVisible(false),
          style: "cancel",
        },
      ]);
    }
  };

  const abrirScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitas otorgar permiso de cámara para escanear el código QR"
        );
        return;
      }
    }

    setScanned(false);
    setScannerVisible(true);
  };

  // 🔹 Estados visuales
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

  // 🔹 Render principal
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
              onPress={abrirScanner}
            >
              <Text style={styles.botonTexto}>Escanear QR para entrega</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={scannerVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => {
              setScannerVisible(false);
              setScanned(false);
            }}
          >
            <View style={styles.modalScanner}>
              <View style={styles.scannerHeader}>
                <Text style={styles.scannerTitulo}>Escanear código QR</Text>
                <Text style={styles.scannerSubtitulo}>
                  Apunta la cámara al código QR del repartidor
                </Text>
              </View>

              <View style={styles.cameraContainer}>
                {permission?.granted ? (
                  <CameraView
                    style={styles.cameraView}
                    facing="back"
                    barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    onBarcodeScanned={
                      scanned ? undefined : handleBarCodeScanned
                    }
                  >
                    <View style={styles.qrMarcoContainer}>
                      <View style={styles.qrMarco} />
                    </View>
                  </CameraView>
                ) : (
                  <View style={styles.permisoContainer}>
                    <Text style={styles.permisoTexto}>
                      Se requiere permiso de cámara para escanear códigos QR
                    </Text>
                    <TouchableOpacity
                      style={styles.botonPermiso}
                      onPress={requestPermission}
                    >
                      <Text style={styles.botonTexto}>Otorgar permiso</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.scannerFooter}>
                <TouchableOpacity
                  style={styles.botonCancelar}
                  onPress={() => {
                    setScannerVisible(false);
                    setScanned(false);
                  }}
                >
                  <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
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

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
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
                      Alert.alert(
                        "¡Gracias!",
                        "Tu calificación ha sido enviada."
                      );
                      setModalVisible(false);
                    } catch (err) {
                      console.error("Error al enviar calificación:", err);
                      Alert.alert(
                        "Error",
                        err.response?.data?.message ||
                          "No se pudo enviar la calificación."
                      );
                    }
                  }}
                />
                <TouchableOpacity
                  style={styles.botonCancelarCalificacion}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.textoCancelarCalificacion}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </ScrollView>
  );
}
