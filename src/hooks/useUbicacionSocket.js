// hooks/useUbicacionSocket.js
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export const useUbicacionSocket = (pedidoId, habilitado = false) => {
  const [ubicacion, setUbicacion] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("📡 useUbicacionSocket INIT", { pedidoId, habilitado });

    if (!pedidoId || !habilitado) {
      console.log("⛔ Socket NO habilitado");
      return;
    }

    const BACKEND_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
    console.log("🔗 BACKEND_URL:", BACKEND_URL);

    // Crear socket
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("🟢 Conectado al socket:", socket.id);
      socket.emit("joinPedido", pedidoId);
      console.log("➡️ joinPedido enviado:", pedidoId);
    });

    socket.on("ubicacionActualizada", (data) => {
      console.log("📍 ubicación recibida cruda:", data);

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

      console.log("📍 ubicación procesada:", nuevaUbicacion);
      setUbicacion(nuevaUbicacion);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket desconectado");
    });

    return () => {
      console.log("👋 leavePedido:", pedidoId);
      socket.emit("leavePedido", pedidoId);
      socket.disconnect();
    };
  }, [pedidoId, habilitado]);

  return ubicacion;
};
