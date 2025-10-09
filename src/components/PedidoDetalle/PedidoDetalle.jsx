import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import usePedidosStore from '../../stores/pedidosStore';
import styles from './PedidoDetalleStyles';

export default function PedidoDetalle({ route, navigation }) {
    const { pedidoId, pedido: pedidoInicial } = route.params;
    const {
        pedidoSeleccionado,
        loading,
        error,
        fetchPedidoDetalle,
        actualizarEstado,
        clearError,
        clearPedidoSeleccionado
    } = usePedidosStore();

    const [actualizandoEstado, setActulizandoEstado] = useState(false);

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
        if (error) {
            Alert.alert('Error', error, [
                { text: 'OK', onPress: clearError }
            ]);
        }
    }, [error]);

    const getEstadoColor = (estado) => {
        switch (estado?.nombre_estado) {
            case 'Asignado': return '#007AFF';
            case 'En camino': return '#FF9500';
            case 'Entregado': return '#28a745';
            default: return '#666';
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCambiarEstado = (nuevoEstado) => {
        Alert.alert(
            'Confirmar cambio de estado',
            `¿Cambiar el estado del pedido a "${nuevoEstado}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Confirmar',
                    onPress: () => cambiarEstado(nuevoEstado),
                    style: 'default'
                }
            ]
        );
    };

    const cambiarEstado = async (nuevoEstado) => {
        setActualizandoEstado(true);
        try {
            await actualizarEstado(pedidoId, nuevoEstado);
            Alert.alert('Éxito', `Estado actualizado a "${nuevoEstado}"`);

            //Actualizar los datos localmente
            await fetchPedidoDetalle(pedidoId);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el estado del pedido');
        } finally {
            setActualizandoEstado(false);
        }
    };

    const renderBotonesEstado = () => {
        const estadoActual = pedido?.estado?.nombre_estado;

        if (estadoActual === 'Entregado') {
            return (
                <View style={styles.estadoCompletado}>
                    <Text style={styles.estadoCompletadoText}>Pedido completado</Text>
                </View>
            );
        }

        return (
            <View style={styles.botonesContainer}>
                {estadoActual === 'Asignado' && (
                    <TouchableOpacity
                        style={[styles.botonEstado, styles.botonEnCamino]}
                        onPress={() => handleCambiarEstado('En camino')}
                        disabled={actualizandoEstado}
                    >
                        {actualizandoEstado ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.botonEstadoText}>Iniciar entrega</Text>
                        )}
                    </TouchableOpacity>
                )}

                {estadoActual === 'En camino' && (
                    <TouchableOpacity
                        style={[styles.botonEstado, styles.botonEntregado]}
                        onPress={() => handleCambiarEstado('Entregado')}
                        disabled={actualizandoEstado}
                    >
                        {actualizandoEstado ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.botonEstadoText}>Marcar como entregado</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading || !pedido) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando detalle del pedido...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.title}>Pedido #{pedido.id_pedido}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(pedido.estado) }]}>
                    <Text style={styles.estadoText}>{pedido.estado?.nombre_estado || 'Sin estado'}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Cliente</Text>
                <Text style={styles.clienteNombre}>
                    {pedido.cliente?.nombre || 'Sin nombre'} {pedido.cliente?.apellido || ''}
                </Text>
                <Text style={styles.clienteInfo}>
                    {pedido.cliente?.email || 'Sin email'}
                </Text>
                <Text style={styles.clienteInfo}>
                    {pedido.cliente?.telefono || 'Sin teléfono'}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalles del Pedido</Text>
                <View style={styles.direccionContainer}>
                    <Text style={styles.direccionLabel}>Origen:</Text>
                    <Text style={styles.direccionText}>{pedido.direccion_origen || 'No especificado'}</Text>
                </View>
                <View style={styles.direccionContainer}>
                    <Text style={styles.direccionLabel}>Destino:</Text>
                    <Text style={styles.direccionText}>{pedido.direccion_destino}</Text>
                </View>
                <Text style={styles.fechaCreacion}>
                    Creado: {formatearFecha(pedido.fecha_creacion)}
                </Text>
                {pedido.qr_codigo && (
                    <Text style={styles.qrCodigo}>
                        Código QR: {pedido.qr_codigo}
                    </Text>
                )}
            </View>

            {renderBotonesEstado()}
        </ScrollView>
    );
}