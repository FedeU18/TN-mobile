import { useEffect, useState } from "react";
import io from "socket.io-client";
import { getPedidoDetalleCliente } from "../utils/pedidoService";

export function usePedidoDetalleCliente(pedidoId) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [origen, setOrigen] = useState(null);
  const [destino, setDestino] = useState(null);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        setLoading(true);
        const data = await getPedidoDetalleCliente(pedidoId);
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
        console.error("Error al obtener detalle del pedido:", err);
        setError("No se pudo cargar el detalle del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetalle();
  }, [pedidoId]);

  // Socket de actualizaciones
  useEffect(() => {
    const socket = io(
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
      {
        transports: ["websocket"],
      }
    );

    socket.on("estadoActualizado", (data) => {
      if (data.pedidoId === Number(pedidoId)) {
        setDetalle((prev) => ({
          ...prev,
          estado: { nombre_estado: data.nuevoEstado },
          ...(data.fecha_entrega ? { fecha_entrega: data.fecha_entrega } : {}),
        }));
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Error de conexión socket (cliente):", err.message);
    });

    return () => {
      socket.emit("leavePedido", pedidoId);
      socket.disconnect();
    };
  }, [pedidoId]);

  return { detalle, loading, error, origen, destino, setDetalle };
}
