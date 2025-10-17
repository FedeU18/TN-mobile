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

    // Verificar y solicitar permisos al inicializar
    useEffect(() => {
        const inicializarPermisos = async () => {
            try {
                const servicioHabilitado = await verificarEstadoUbicacion();
                if (!servicioHabilitado) {
                    Alert.alert(
                        "Servicio de ubicación deshabilitado",
                        "Para realizar las entregas necesitás habilitar el servicio de ubicación en la configuración de tu dispositivo."
                    );
                    return;
                }

                const permisos = await solicitarPermisosUbicacion();
                setPermisosUbicacion(permisos);

                if (!permisos.foreground) {
                    Alert.alert(
                        "Permisos de ubicación requeridos",
                        "Para realizar las entregas necesitás otorgar permisos de ubicación.",
                        [{ text: "OK" }]
                    );
                }
            } catch (error) {
                setError(error.message);
                Alert.alert('Error', error.message);
            }
        };

        inicializarPermisos();

        //Monitorear cambios en el estado de la app
        const handleAppStateChange = (nextAppState) => {
            appStateRef.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription?.remove();
        };
    }, []);
        // Detener seguimiento automáticamente si el pedido activo se borra
        useEffect(() => {
            if (!pedidoActivoRef.current && estaRastreando) {
                detenerSeguimiento();
            }
        }, [estaRastreando]);

    // Función para iniciar el rastreo
    const iniciarSeguimiento = async (pedidoId) => {
        if (!permisosUbicacion.foreground) {
            Alert.alert(
                "Permisos de ubicación requeridos",
                "Para realizar las entregas necesitás otorgar permisos de ubicación."
            );
            return false;
        }

        const permisos = await solicitarPermisosUbicacion();
        setPermisosUbicacion(permisos);

<<<<<<< HEAD
            console.log("Iniciando seguimiento de ubicación para el pedido:", pedidoId);

            //Enviar ubicación inicial inmediatamente
            await enviarUbicacion(pedidoId);

            //Configurar intervalo para enviar ubicación cada 10 segundos
            intervaloRef.current = setInterval(async () => {
                if (pedidoActivoRef.current === pedidoId) {
                    await enviarUbicacion(pedidoId);
                }
            }, 10000);

            return true;
        } catch (error) {
            console.error("Error al iniciar el seguimiento:", error);
            setError(error.message);
            setEstaRastreando(false);
            return false;
=======
        if (!permisos.foreground) {
          Alert.alert(
            "Permisos de ubicación requeridos",
            "Para realizar las entregas necesitás otorgar permisos de ubicación.",
            [{ text: "OK" }]
          );
>>>>>>> 405d6059d062e94e3b2fc40905ac10630594eb8f
        }
      } catch (error) {
        setError(error.message);
        Alert.alert("Error", error.message);
      }
    };

    inicializarPermisos();

    //Monitorear cambios en el estado de la app
    const handleAppStateChange = (nextAppState) => {
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  // Función para iniciar el rastreo
  const iniciarSeguimiento = async (pedidoId) => {
    if (!permisosUbicacion.foreground) {
      Alert.alert(
        "Permisos de ubicación requeridos",
        "Para realizar las entregas necesitás otorgar permisos de ubicación."
      );
      return false;
    }

    try {
      setEstaRastreando(true);
      setError(null);
      pedidoActivoRef.current = pedidoId;

      console.log(
        "Iniciando seguimiento de ubicación para el pedido:",
        pedidoId
      );

      //Enviar ubicación inicial inmediatamente

      await enviarUbicacion(pedidoId);

      //Configurar intervalo para enviar ubicación cada 10 segundos
      intervaloRef.current = setInterval(async () => {
        if (pedidoActivoRef.current === pedidoId) {
          await enviarUbicacion(pedidoId);
        }
      }, 10000);

      return true;
    } catch (error) {
      console.error("Error al iniciar el seguimiento:", error);
      setError(error.message);
      setEstaRastreando(false);
      return false;
    }
  };

  const detenerSeguimiento = () => {
    console.log(
      "Deteniendo seguimiento de ubicación para el pedido:",
      pedidoActivoRef.current
    );

    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }

    pedidoActivoRef.current = null;
    setEstaRastreando(false);
    setError(null);
  };

  const enviarUbicacion = async (pedidoId) => {
    try {
      const ubicacion = await obtenerUbicacionActual();
      setUltimaUbicacion(ubicacion);

      console.log(
        `Enviando ubicación: ${ubicacion.latitud}, ${ubicacion.longitud}`
      );

      await enviarUbicacionAlBackend(pedidoId, ubicacion);
    } catch (error) {
      console.error("Error al enviar la ubicación:", error);

      if (error.message.includes("timeout")) {
        setError("Timeout al obtener la ubicación. Verificá tu conexión.");
      } else {
        setError(error.message);
      }
    }
  };

  const forzarEnvioUbicacion = async () => {
    if (pedidoActivoRef.current && permisosUbicacion.foreground) {
      await enviarUbicacion(pedidoActivoRef.current);
    }
  };

  const limpiarSeguimiento = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
    pedidoActivoRef.current = null;
    setEstaRastreando(false);
    setError(null);
  };

  return {
    estaRastreando,
    permisosUbicacion,
    ultimaUbicacion,
    error,
    iniciarSeguimiento,
    detenerSeguimiento,
    forzarEnvioUbicacion,
    limpiarSeguimiento
  };
};

export default usarUbicacion;
