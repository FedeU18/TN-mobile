import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import {
  getPedidoDetalle,
  actualizarEstadoPedido,
} from "../../utils/pedidoService";
import usarUbicacion from "../../hooks/usarUbicacion";
import MapaRepartidor from "../MapaRepartidor/MapaRepartidor";

export default function PedidoDetalleRepartidor({ pedido }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [mostrarQR, setMostrarQR] = useState(false);

  const {
    estaRastreando,
    ultimaUbicacion,
    iniciarSeguimiento,
    detenerSeguimiento,
  } = usarUbicacion();

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        const data = await getPedidoDetalle(pedido.id_pedido);
        setDetalle(data);

        // ✅ Campos correctos según tu backend
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
        console.error("Error al cargar detalle:", err);
        setError("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();

    return () => detenerSeguimiento();
  }, [pedido.id_pedido]);

  const manejarCambioEstado = async (nuevoEstado) => {
    try {
      const resp = await actualizarEstadoPedido(pedido.id_pedido, nuevoEstado);

      Alert.alert("Éxito", `Estado actualizado a ${nuevoEstado}`);

      setDetalle((prev) => ({
        ...prev,
        ...resp,
        estado: { nombre_estado: nuevoEstado },
      }));

      if (nuevoEstado === "En camino" && resp?.qr_codigo) {
        setMostrarQR(true);
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
    }
  };

  const manejarSeguimiento = async () => {
    if (estaRastreando) {
      detenerSeguimiento();
      Alert.alert("Seguimiento detenido", "Ya no se enviará tu ubicación.");
    } else {
      const ok = await iniciarSeguimiento(pedido.id_pedido);
      if (ok) {
        Alert.alert("Seguimiento iniciado", "Tu ubicación se está enviando.");
      }
    }
  };

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Pedido #{detalle.id_pedido}</Text>
        <Text style={[styles.estado, { color: estadoColor }]}>
          Estado: {detalle.estado?.nombre_estado}
        </Text>

        <Text style={styles.texto}>
          <Text style={styles.label}>Cliente:</Text>{" "}
          {detalle.cliente
            ? `${detalle.cliente.nombre} ${detalle.cliente.apellido}`
            : "Sin asignar"}
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

      <MapaRepartidor
        repartidorUbicacion={ultimaUbicacion}
        origenUbicacion={origen}
        destinoUbicacion={destino}
      />

      {/* Botón de seguimiento */}
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

      {/* Botones de estado */}
      <View style={styles.botonesEstado}>
        {detalle.estado?.nombre_estado === "Asignado" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#FF9500" }]}
            onPress={() => manejarCambioEstado("En camino")}
          >
            <Text style={styles.botonTexto}>Iniciar trayecto</Text>
          </TouchableOpacity>
        )}

        {/* ✅ Solo mostrar botón QR cuando está “En camino” */}
        {detalle.estado?.nombre_estado === "En camino" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#007AFF" }]}
            onPress={() => setMostrarQR(true)}
          >
            <Text style={styles.botonTexto}>Mostrar QR del pedido</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal del QR */}
      <Modal visible={mostrarQR} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              Mostrale este código al cliente
            </Text>

            {/* ✅ Aseguramos que muestre correctamente la imagen Base64 */}
            {detalle?.qr_codigo ? (
              <Image
                source={{
                  uri: detalle.qr_codigo.startsWith("data:image")
                    ? detalle.qr_codigo
                    : `data:image/png;base64,${detalle.qr_codigo}`,
                }}
                style={{ width: 220, height: 220, alignSelf: "center" }}
                resizeMode="contain"
              />
            ) : (
              <Text>No hay QR disponible</Text>
            )}

            <TouchableOpacity
              onPress={() => setMostrarQR(false)}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#333" },
  estado: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  texto: { fontSize: 15, marginBottom: 6 },
  label: { fontWeight: "bold", color: "#555" },
  boton: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botonTexto: { color: "#fff", fontWeight: "600", fontSize: 16 },
  botonesEstado: {
    marginTop: 10,
    marginBottom: 25,
    gap: 10,
    marginHorizontal: 15,
  },
  botonEstado: { padding: 14, borderRadius: 10, alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    alignItems: "center",
  },
});
