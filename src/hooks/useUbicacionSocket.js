// hooks/useUbicacionSocket.js
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const useUbicacionSocket = (pedidoId, habilitado = false) => {
  const [ubicacion, setUbicacion] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {

    if (!pedidoId || !habilitado) {
      return;
    }

    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

    // Crear socket
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      socket.emit("joinPedido", pedidoId);
    });

    socket.on("ubicacionActualizada", (data) => {

      // Convertir a números SIEMPRE
      const lat = Number(data?.latitud);
      const lon = Number(data?.longitud);

      if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        console.warn("⚠️ ubicación inválida recibida:", data);
        return;
      }

      const nuevaUbicacion = {
        latitud: lat,
        longitud: lon,
        timestamp: Date.now(),
      };

      setUbicacion(nuevaUbicacion);
    });

    socket.on("disconnect", () => {
    });

    return () => {
      socket.emit("leavePedido", pedidoId);
      socket.disconnect();
    };
  }, [pedidoId, habilitado]);

  return ubicacion;
};
