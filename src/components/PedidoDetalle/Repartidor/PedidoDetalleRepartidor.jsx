import React, { useEffect, useState, useCallback, useRef } from "react";
import io from "socket.io-client";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import {
  getPedidoDetalle,
  actualizarEstadoPedido,
} from "../../../utils/pedidoService";
import usarUbicacion from "../../../hooks/usarUbicacion";
import MapaRepartidor from "../../MapaRepartidor/MapaRepartidor";
import styles from "./PedidoDetalleRepartidorStyles";

export default function PedidoDetalleRepartidor({ pedido }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [mostrarQR, setMostrarQR] = useState(false);

  // 👉 Nuevo: flag para evitar alertas duplicadas
  const cambioLocalRef = useRef(false);

  const {
    estaRastreando,
    ultimaUbicacion,
    iniciarSeguimiento,
    detenerSeguimiento,
  } = usarUbicacion();

  // 🔹 Fetch detalle reutilizable
  const fetchDetalle = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPedidoDetalle(pedido.id_pedido);
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
      console.error("Error al cargar detalle:", err);
      setError("No se pudo cargar el pedido.");
    } finally {
      setLoading(false);
    }
  }, [pedido.id_pedido]);

  // 🔹 Carga inicial
  useEffect(() => {
    fetchDetalle();
    return () => detenerSeguimiento();
  }, [fetchDetalle]);

  // 🧩 Socket: escuchar cambios de estado en tiempo real
  useEffect(() => {
    const socket = io(
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
      { transports: ["websocket"] }
    );

    socket.on("connect", () => {
      console.log("✅ Socket conectado:", socket.id);
      socket.emit("joinPedido", pedido.id_pedido);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión socket:", err.message);
    });

    socket.on("estadoActualizado", async (data) => {
      if (data.pedidoId === Number(pedido.id_pedido)) {
        console.log("📦 Estado actualizado recibido:", data);

        // Actualizamos estado local rápido
        setDetalle((prev) => ({
          ...prev,
          estado: { nombre_estado: data.nuevoEstado },
          ...(data.qr_codigo ? { qr_codigo: data.qr_codigo } : {}),
        }));

        if (
          data.nuevoEstado === "En camino" ||
          data.nuevoEstado === "Entregado"
        ) {
          await fetchDetalle();
        }

        // 👇 Evitamos alerta si el cambio fue hecho localmente
        if (!cambioLocalRef.current) {
          Alert.alert(
            "🔔 Pedido actualizado",
            `Nuevo estado: ${data.nuevoEstado}`
          );
        } else {
          // reset del flag luego de recibir confirmación
          cambioLocalRef.current = false;
        }
      }
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket desconectado:", reason);
    });

    return () => {
      socket.emit("leavePedido", pedido.id_pedido);
      socket.off("estadoActualizado");
      socket.disconnect();
    };
  }, [pedido.id_pedido, fetchDetalle]);

  // 🔸 Cambiar estado manualmente
  const manejarCambioEstado = async (nuevoEstado) => {
    try {
      cambioLocalRef.current = true; // 👉 marcamos que es un cambio local
      const resp = await actualizarEstadoPedido(pedido.id_pedido, nuevoEstado);

      Alert.alert("Éxito", `Estado actualizado a ${nuevoEstado}`);

      setDetalle((prev) => ({
        ...prev,
        ...resp,
        estado: { nombre_estado: nuevoEstado },
      }));

      if (nuevoEstado === "En camino" || nuevoEstado === "Entregado") {
        await fetchDetalle();
      }
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
      cambioLocalRef.current = false; // revertir flag en caso de error
    }
  };

  // 🔸 Iniciar/detener seguimiento de ubicación
  const manejarSeguimiento = async () => {
    if (estaRastreando) {
      detenerSeguimiento();
      Alert.alert("Seguimiento detenido", "Ya no se enviará tu ubicación.");
    } else {
      const ok = await iniciarSeguimiento(pedido.id_pedido);
      if (ok)
        Alert.alert("Seguimiento iniciado", "Tu ubicación se está enviando.");
    }
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

      <Modal visible={mostrarQR} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              Mostrale este código al cliente
            </Text>

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
