// hooks/useUbicacionSocket.js
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const useUbicacionSocket = (pedidoId, habilitado = false) => {
  const [ubicacion, setUbicacion] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!pedidoId || !habilitado) return;

    const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
    if (!BACKEND_URL) {
      console.warn("⚠️ EXPO_PUBLIC_BACKEND_URL no está definido en .env");
      return;
    }

    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"], // mejor desempeño en mobile
    });

    const socket = socketRef.current;

    socket.emit("joinPedido", pedidoId);

    socket.on("ubicacionActualizada", (data) => {
      if (data?.latitud && data?.longitud) {
        setUbicacion({
          latitud: data.latitud,
          longitud: data.longitud,
          timestamp: Date.now(),
        });
      }
    });

    return () => {
      socket.emit("leavePedido", pedidoId);
      socket.disconnect();
    };
  }, [pedidoId, habilitado]);

  return ubicacion;
};
