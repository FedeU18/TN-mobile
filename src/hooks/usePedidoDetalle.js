import { useEffect, useState, useCallback, useRef } from "react";
import io from "socket.io-client";
import { Alert } from "react-native";
import {
  getPedidoDetalle,
  actualizarEstadoPedido,
} from "../utils/pedidoService";
import usarUbicacion from "./usarUbicacion";

export default function usePedidoDetalle(pedidoId) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);
  const [mostrarQR, setMostrarQR] = useState(false);
  const cambioLocalRef = useRef(false);

  const {
    estaRastreando,
    ultimaUbicacion,
    iniciarSeguimiento,
    detenerSeguimiento,
  } = usarUbicacion();

  const fetchDetalle = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPedidoDetalle(pedidoId);
      setDetalle(data);
      if (data.origen_latitud && data.origen_longitud)
        setOrigen({
          latitud: parseFloat(data.origen_latitud),
          longitud: parseFloat(data.origen_longitud),
        });
      if (data.destino_latitud && data.destino_longitud)
        setDestino({
          latitud: parseFloat(data.destino_latitud),
          longitud: parseFloat(data.destino_longitud),
        });
    } catch (err) {
      setError("No se pudo cargar el pedido.");
    } finally {
      setLoading(false);
    }
  }, [pedidoId]);

  const manejarCambioEstado = async (nuevoEstado) => {
    try {
      cambioLocalRef.current = true;
      const resp = await actualizarEstadoPedido(pedidoId, nuevoEstado);
      Alert.alert("Éxito", `Estado actualizado a ${nuevoEstado}`);
      setDetalle((prev) => ({
        ...prev,
        ...resp,
        estado: { nombre_estado: nuevoEstado },
      }));
      if (["En camino", "Entregado"].includes(nuevoEstado))
        await fetchDetalle();
    } catch (err) {
      Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
      cambioLocalRef.current = false;
    }
  };

  const manejarSeguimiento = async () => {
    if (estaRastreando) {
      detenerSeguimiento();
      Alert.alert("Seguimiento detenido", "Ya no se enviará tu ubicación.");
    } else {
      const ok = await iniciarSeguimiento(pedidoId);
      if (ok)
        Alert.alert("Seguimiento iniciado", "Tu ubicación se está enviando.");
    }
  };

  useEffect(() => {
    fetchDetalle();
    return () => detenerSeguimiento();
  }, [fetchDetalle]);

  useEffect(() => {
    const socket = io(
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
      { transports: ["websocket"] }
    );
    socket.on("connect", () => socket.emit("joinPedido", pedidoId));
    socket.on("estadoActualizado", async (data) => {
      if (data.pedidoId === Number(pedidoId)) {
        setDetalle((prev) => ({
          ...prev,
          estado: { nombre_estado: data.nuevoEstado },
          ...(data.qr_codigo ? { qr_codigo: data.qr_codigo } : {}),
        }));
        if (["En camino", "Entregado"].includes(data.nuevoEstado))
          await fetchDetalle();
        if (!cambioLocalRef.current)
          Alert.alert(
            "🔔 Pedido actualizado",
            `Nuevo estado: ${data.nuevoEstado}`
          );
        else cambioLocalRef.current = false;
      }
    });
    return () => {
      socket.emit("leavePedido", pedidoId);
      socket.off("estadoActualizado");
      socket.disconnect();
    };
  }, [pedidoId, fetchDetalle]);

  return {
    detalle,
    loading,
    error,
    origen,
    destino,
    mostrarQR,
    setMostrarQR,
    ultimaUbicacion,
    estaRastreando,
    manejarCambioEstado,
    manejarSeguimiento,
  };
}
