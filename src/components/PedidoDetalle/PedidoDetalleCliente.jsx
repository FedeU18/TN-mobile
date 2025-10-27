import React, { useEffect, useState } from "react";
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
} from "../../utils/pedidoService";
import { useUbicacionSocket } from "../../hooks/useUbicacionSocket";
import MapaRepartidor from "../MapaRepartidor/MapaRepartidor";

export default function PedidoDetalleCliente({ pedido }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);

  // Repartidor en tiempo real vía socket
  const ubicacionRepartidor = useUbicacionSocket(
    pedido.id_pedido,
    pedido.estado?.nombre_estado === "En camino"
  );

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        const data = await getPedidoDetalleCliente(pedido.id_pedido);
        setDetalle(data);

        // Si la API devuelve ubicaciones fijas, las guardamos
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

      {/* Estado de seguimiento */}
      {detalle.estado?.nombre_estado === "En camino" && (
        <View style={styles.seguimiento}>
          <Text style={styles.seguimientoTexto}>
            📍 Seguimiento en tiempo real activo
          </Text>
        </View>
      )}

      {detalle.estado?.nombre_estado === "Entregado" && (
        <View style={styles.seguimiento}>
          <Text style={styles.entregadoTexto}>✅ Pedido entregado</Text>
        </View>
      )}
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
  seguimiento: {
    backgroundColor: "#e6f7ff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: "center",
  },
  seguimientoTexto: {
    color: "#007AFF",
    fontWeight: "600",
  },
  entregadoTexto: {
    color: "#28a745",
    fontWeight: "600",
  },
  noMapa: {
    alignItems: "center",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
