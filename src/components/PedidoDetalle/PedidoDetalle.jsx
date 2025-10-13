import React, { use, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import usePedidoStore from "../../stores/pedidoStore";
import usarUbicacion from "../../hooks/usarUbicacion";
import styles from "./PedidoDetalleStyles";
// import MapaRepartidor from '../MapaRepartidor/MapaRepartidor';

export default function PedidoDetalle({ route, navigation }) {
  const { pedidoId, pedidoInicial } = route.params;
  const {
    pedidoSeleccionado,
    pedidoEnSeguimiento,
    loading,
    error: errorPedido,
    fetchPedidoDetalle,
    cambiarEstadoPedido,
    setPedidoEnSeguimiento,
    clearPedidoEnSeguimiento,
    clearError,
    clearPedidoSeleccionado,
  } = usePedidoStore();

  const {
    estaRastreando,
    permisosUbicacion,
    ultimaUbicacion,
    error: errorUbicacion,
    iniciarSeguimiento,
    detenerSeguimiento,
  } = usarUbicacion();

  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  // Abrir directamente la página de permisos de la app en Android
  const abrirConfiguracionApp = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error("Error al abrir configuración:", error);
      Alert.alert(
        "No se pudo abrir la configuración",
        "Por favor, ve manualmente a Configuración > Aplicaciones > TN-mobile > Permisos > Ubicación"
      );
    }
  };

  // Priorizar pedidoSeleccionado del store (datos más recientes)
  const pedido = pedidoSeleccionado || pedidoInicial;

  useEffect(() => {
    if (pedidoId && !pedidoSeleccionado) {
      fetchPedidoDetalle(pedidoId);
    }

    return () => {
      clearPedidoSeleccionado();
    };
  }, [pedidoId]);

  useEffect(() => {
    if (errorPedido) {
      Alert.alert("Error", errorPedido, [{ text: "OK", onPress: clearError }]);
    }
  }, [errorPedido]);

  // Manejar seguimiento de ubicación
  useEffect(() => {
    if (pedido) {
      const estadoActual = pedido.estado?.nombre_estado;

      if (
        estadoActual === "En camino" &&
        !estaRastreando &&
        pedidoEnSeguimiento === pedidoId
      ) {
        console.log(pedidoId, "en camino, iniciando seguimiento de ubicación.");
        iniciarSeguimiento(pedidoId);
        setPedidoEnSeguimiento(pedidoId);
      } else if (
        estadoActual !== "En camino" &&
        estaRastreando &&
        pedidoEnSeguimiento === pedidoId
      ) {
        console.log(
          pedidoId,
          "entregrado, deteniendo seguimiento de ubicación."
        );
        detenerSeguimiento();
        clearPedidoEnSeguimiento();
      }
    }
  }, [pedido?.estado?.nombre_estado, estaRastreando, pedidoEnSeguimiento]);

  // Limpiar seguimiento al salir del componente
  useEffect(() => {
    return () => {
      if (estaRastreando && pedidoEnSeguimiento === pedidoId) {
        detenerSeguimiento();
      }
    };
  }, []);

  const getEstadoColor = (estado) => {
    switch (estado?.nombre_estado) {
      case "Pendiente":
        return "#ffc107";
      case "Asignado":
        return "#007AFF";
      case "En camino":
        return "#FF9500";
      case "Entregado":
        return "#28a745";
      case "Cancelado":
        return "#dc3545";
      default:
        return "#666";
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCambiarEstado = (nuevoEstado) => {
    //Verificar permisos de ubicación antes de cambiar a "En camino"
    if (nuevoEstado === "En camino" && !permisosUbicacion.foreground) {
      Alert.alert(
        "Permisos de ubicación requeridos",
        "Para iniciar la entrega necesitamos acceso a tu ubicación. Por favor, habilitá los permisos en la configuración de tu dispositivo.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Abrir configuración",
            onPress: abrirConfiguracionApp,
            style: "default",
          },
        ]
      );
      return;
    }

    Alert.alert(
      "Confirmar cambio de estado",
      `¿Cambiar el estado del pedido a "${nuevoEstado}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => cambiarEstado(nuevoEstado),
          style: "default",
        },
      ]
    );
  };

  const cambiarEstado = async (nuevoEstado) => {
    setActualizandoEstado(true);
    try {
      await cambiarEstadoPedido(pedidoId, nuevoEstado);

      // Diferentes mensajes según el estado
      const mensajes = {
        "En camino": {
          titulo: "Entrega iniciada",
          mensaje:
            "Has iniciado la entrega del pedido. El cliente será notificado del progreso.",
        },
        Entregado: {
          titulo: "Pedido completado",
          mensaje:
            "¡Excelente trabajo! El pedido ha sido entregado exitosamente.",
        },
      };

      const mensaje = mensajes[nuevoEstado] || {
        titulo: "✅ Estado actualizado",
        mensaje: `El pedido ha sido marcado como "${nuevoEstado}".`,
      };

      Alert.alert(mensaje.titulo, mensaje.mensaje, [
        { text: "OK", style: "default" },
      ]);

      // Actualizar los datos del pedido para reflejar el cambio
      await fetchPedidoDetalle(pedidoId);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Alert.alert(
        "Error al actualizar",
        "No se pudo cambiar el estado del pedido. Verifica tu conexión e inténtalo de nuevo.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Reintentar", onPress: () => cambiarEstado(nuevoEstado) },
        ]
      );
    } finally {
      setActualizandoEstado(false);
    }
  };

  // Para mostrar si hay estado de seguimiento (borrar si funciona)
  const renderEstadoSeguimiento = () => {
    if (!estaRastreando || pedidoEnSeguimiento !== pedidoId) return null;

    return (
      <View style={styles.seguimientoContainer}>
        <View style={styles.seguimientoHeader}>
          <Text style={styles.seguimientoTitulo}>Seguimiento activo</Text>
          <View style={styles.indicadorActivo} />
        </View>
        {ultimaUbicacion && (
          <Text style={styles.seguimientoTexto}>
            Última ubicación:{" "}
            {new Date(ultimaUbicacion.timestamp).toLocaleTimeString("es-ES")}
          </Text>
        )}
        {errorUbicacion && (
          <Text style={styles.seguimientoError}>{errorUbicacion}</Text>
        )}
      </View>
    );
  };

  const renderBotonesEstado = () => {
    const estadoActual = pedido?.estado?.nombre_estado;

    if (estadoActual === "Entregado") {
      return (
        <View style={styles.estadoCompletado}>
          <Text style={styles.estadoCompletadoText}>✅ Pedido completado</Text>
          <Text style={styles.estadoCompletadoSubtext}>
            Entregado exitosamente
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.botonesContainer}>
        <View style={styles.estadoActualContainer}>
          <Text style={styles.estadoActualLabel}>Estado actual:</Text>
          <Text
            style={[
              styles.estadoActualText,
              { color: getEstadoColor(pedido.estado) },
            ]}
          >
            {estadoActual}
          </Text>
        </View>

        {renderEstadoSeguimiento()}

        {estadoActual === "Asignado" && (
          <TouchableOpacity
            style={[
              styles.botonEstado,
              styles.botonEnCamino,
              actualizandoEstado && styles.botonDeshabilitado,
            ]}
            onPress={() => handleCambiarEstado("En camino")}
            disabled={actualizandoEstado}
          >
            {actualizandoEstado ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.botonEstadoText}>Iniciar entrega</Text>
            )}
          </TouchableOpacity>
        )}

        {estadoActual === "En camino" && (
          <TouchableOpacity
            style={[
              styles.botonEstado,
              styles.botonEntregado,
              actualizandoEstado && styles.botonDeshabilitado,
            ]}
            onPress={() => handleCambiarEstado("Entregado")}
            disabled={actualizandoEstado}
          >
            {actualizandoEstado ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.botonEstadoText}>
                  Marcar como entregado
                </Text>
                <Text style={styles.botonEstadoSubtext}>Completar pedido</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // const mostrarMapa = pedido.estado === "En camino" && ultimaUbicacion;

  if (loading || !pedido) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando detalle del pedido...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Pedido #{pedido.id_pedido}</Text>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: getEstadoColor(pedido.estado) },
          ]}
        >
          <Text style={styles.estadoText}>
            {pedido.estado?.nombre_estado || "Sin estado"}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información del Cliente</Text>
        <Text style={styles.clienteNombre}>
          {pedido.cliente?.nombre || "Sin nombre"}{" "}
          {pedido.cliente?.apellido || ""}
        </Text>
        <Text style={styles.clienteInfo}>
          {pedido.cliente?.email || "Sin email"}
        </Text>
        <Text style={styles.clienteInfo}>
          {pedido.cliente?.telefono || "Sin teléfono"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalles del Pedido</Text>
        <View style={styles.direccionContainer}>
          <Text style={styles.direccionLabel}>Origen:</Text>
          <Text style={styles.direccionText}>
            {pedido.direccion_origen || "No especificado"}
          </Text>
        </View>
        <View style={styles.direccionContainer}>
          <Text style={styles.direccionLabel}>Destino:</Text>
          <Text style={styles.direccionText}>{pedido.direccion_destino}</Text>
        </View>
        <Text style={styles.fechaCreacion}>
          Creado: {formatearFecha(pedido.fecha_creacion)}
        </Text>
        {pedido.qr_codigo && (
          <Text style={styles.qrCodigo}>Código QR: {pedido.qr_codigo}</Text>
        )}
      </View>

      <View style={styles.section}>
        {/*
        {mostrarMapa && (
          <MapaRepartidor latitud={ultimaUbicacion?.latitud} longitud={ultimaUbicacion?.longitud} />
        )}
        */}
      </View>

      {renderBotonesEstado()}
    </ScrollView>
  );
}
