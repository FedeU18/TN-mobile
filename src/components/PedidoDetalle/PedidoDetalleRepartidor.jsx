import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
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

        if (data.origen_lat && data.origen_lng) {
          setOrigen({
            latitud: data.origen_lat,
            longitud: data.origen_lng,
          });
        }

        if (data.destino_lat && data.destino_lng) {
          setDestino({
            latitud: data.destino_lat,
            longitud: data.destino_lng,
          });
        }
      } catch (err) {
        console.error("Error al cargar detalle del pedido:", err);
        setError("No se pudo cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();

    return () => {
      detenerSeguimiento();
    };
  }, [pedido.id_pedido]);

  const manejarCambioEstado = async (nuevoEstado) => {
    try {
      await actualizarEstadoPedido(pedido.id_pedido, nuevoEstado);
      Alert.alert("Éxito", `Estado actualizado a ${nuevoEstado}`);
      setDetalle((prev) => ({
        ...prev,
        estado: { nombre_estado: nuevoEstado },
      }));
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
        Alert.alert(
          "Seguimiento iniciado",
          "Tu ubicación se está enviando al sistema."
        );
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

      {/* Mapa */}
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
        {detalle.estado?.nombre_estado === "Pendiente" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#FF9500" }]}
            onPress={() => manejarCambioEstado("En camino")}
          >
            <Text style={styles.botonTexto}>Marcar como En camino</Text>
          </TouchableOpacity>
        )}

        {detalle.estado?.nombre_estado === "En camino" && (
          <TouchableOpacity
            style={[styles.botonEstado, { backgroundColor: "#28a745" }]}
            onPress={() => manejarCambioEstado("Entregado")}
          >
            <Text style={styles.botonTexto}>Marcar como Entregado</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  estado: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  texto: {
    fontSize: 15,
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  boton: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  botonesEstado: {
    marginTop: 10,
    marginBottom: 25,
    gap: 10,
    marginHorizontal: 15,
  },
  botonEstado: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
