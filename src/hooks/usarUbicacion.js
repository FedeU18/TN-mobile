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

  // ---- Inicializar permisos al cargar hook ----
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

    return () => subscription?.remove();
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
      pedidoActivoRef.current = pedidoId;
      setEstaRastreando(true);
      setError(null);

      await enviarUbicacion(pedidoId);

      intervaloRef.current = setInterval(async () => {
        if (
          appStateRef.current === "active" &&
          pedidoActivoRef.current === pedidoId
        ) {
          await enviarUbicacion(pedidoId);
        }
      }, 10000);

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
  };

  // ---- Envío de ubicación ----
  const enviarUbicacion = async (pedidoId) => {
    try {
      const ubicacion = await obtenerUbicacionActual();
      setUltimaUbicacion(ubicacion);

      await enviarUbicacionAlBackend(pedidoId, ubicacion);
    } catch (err) {
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
