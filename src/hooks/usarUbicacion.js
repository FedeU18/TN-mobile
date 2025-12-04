import { useState, useEffect, useRef } from "react";
import { Alert, AppState } from "react-native";
import {
  solicitarPermisosUbicacion,
  obtenerUbicacionActual,
  enviarUbicacionAlBackend,
  verificarEstadoUbicacion,
} from "../utils/ubicacionService";

const usarUbicacion = () => {
  const [estaRastreando, setEstaRastreando] = useState(false);
  const [permisosUbicacion, setPermisosUbicacion] = useState({
    foreground: false,
    background: false,
  });
  const [ultimaUbicacion, setUltimaUbicacion] = useState(null);
  const [error, setError] = useState(null);

  const intervaloRef = useRef(null);
  const pedidoActivoRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  // ---- Inicializar permisos ----
  useEffect(() => {
    const inicializarPermisos = async () => {
      try {
        const servicioHabilitado = await verificarEstadoUbicacion();
        if (!servicioHabilitado) {
          Alert.alert(
            "Servicio de ubicación deshabilitado",
            "Para realizar las entregas necesitás habilitar la ubicación en tu dispositivo."
          );
          return;
        }

        const permisos = await solicitarPermisosUbicacion();
        setPermisosUbicacion(permisos);

        if (!permisos.foreground) {
          Alert.alert(
            "Permisos de ubicación requeridos",
            "Para realizar las entregas necesitás otorgar permisos de ubicación."
          );
        }
      } catch (err) {
        setError(err?.message || "Error inicializando permisos");
      }
    };

    inicializarPermisos();

    const subscription = AppState.addEventListener("change", (next) => {
      appStateRef.current = next;
    });

    // ✅ limpiar intervalos si el hook se desmonta
    return () => {
      subscription?.remove();
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    };
  }, []);

  // ---- Iniciar seguimiento ----
  const iniciarSeguimiento = async (pedidoId) => {
    if (!permisosUbicacion.foreground) {
      Alert.alert(
        "Permisos de ubicación requeridos",
        "Para iniciar la entrega necesitamos permisos de ubicación."
      );
      return false;
    }

    try {
      // Evitar duplicar intervalos
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }

      pedidoActivoRef.current = pedidoId;
      setEstaRastreando(true);
      setError(null);

      // Enviar la ubicación inicial
      await enviarUbicacion(pedidoId);

      // Configurar intervalo de envío
      intervaloRef.current = setInterval(async () => {
        if (
          appStateRef.current === "active" &&
          pedidoActivoRef.current === pedidoId
        ) {
          await enviarUbicacion(pedidoId);
        }
      }, 2000);

      return true;
    } catch (err) {
      setError(err.message);
      setEstaRastreando(false);
      return false;
    }
  };

  // ---- Detener seguimiento ----
  const detenerSeguimiento = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    pedidoActivoRef.current = null;
    setEstaRastreando(false);
    console.log("🛑 Seguimiento detenido correctamente");
  };

  // ---- Envío de ubicación ----
  const enviarUbicacion = async (pedidoId) => {
    try {
      const ubicacion = await obtenerUbicacionActual();
      setUltimaUbicacion(ubicacion);
      const respuesta = await enviarUbicacionAlBackend(pedidoId, ubicacion);

      // 👇 Si el backend devuelve 401 (token expirado / sesión cerrada)
      if (respuesta?.status === 401) {
        console.log("⚠️ Token inválido: deteniendo seguimiento...");
        detenerSeguimiento();
      }
    } catch (err) {
      // 👇 Si el backend lanza 401 en el catch
      if (err.message?.includes("401")) {
        console.log("⚠️ Backend devolvió 401. Deteniendo seguimiento...");
        detenerSeguimiento();
      }
      setError(err.message);
    }
  };

  return {
    estaRastreando,
    permisosUbicacion,
    ultimaUbicacion,
    error,
    iniciarSeguimiento,
    detenerSeguimiento,
  };
};

export default usarUbicacion;
