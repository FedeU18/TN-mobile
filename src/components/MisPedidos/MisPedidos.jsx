import React, { useEffect, useEffectEvent } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl
} from 'react-native';
import usePedidoStore from '../../stores/pedidoStore';
import styles from './MisPedidosStyles';

const PedidoItem = ({ pedido, onVerDetalle, userRole }) => {
    const getEstadoColor = (estado) => {
        switch (estado?.nombre_estado) {
            case 'Pendiente': return '#ffc107';
            case 'Asignado': return '#007AFF';
            case 'En camino': return '#FF9500';
            case 'Entregado': return '#28a745';
            case 'Cancelado': return '#dc3545';
            default: return '#666';
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <TouchableOpacity
            style={styles.pedidoCard}
            onPress={() => onVerDetalle(pedido)}
        >
            <View style={styles.pedidoHeader}>
                <Text style={styles.pedidoId}>
                    Pedido #{pedido.id_pedido}
                </Text>
                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(pedido.estado) }]}>
                    <Text style={styles.estadoText}>{pedido.estado?.nombre_estado || 'Sin estado'}</Text>
                </View>
            </View>

            <View style={styles.pedidoInfo}>
                {userRole === 'repartidor' ? (
                    <Text style={styles.cliente}>
                        Cliente: {pedido.cliente?.nombre || 'Sin Nombre'} {pedido.cliente?.apellido || ''}
                    </Text>
                ) : (
                    <Text style={styles.repartidor}>
                        Repartidor: {pedido.repartidor?.nombre || 'No asignado'} {pedido.repartidor?.apellido || ''}
                    </Text>
                )}
                <Text style={styles.direccion}>
                    Destino: {pedido.direccion_destino}
                </Text>
                <Text style={styles.fecha}>
                    Creado: {formatearFecha(pedido.fecha_creacion)}
                </Text>
                
                {/* Indicador de seguimiento para clientes */}
                {userRole === 'cliente' && pedido.estado?.nombre_estado === 'En camino' && (
                    <View style={styles.seguimientoIndicador}>
                        <Text style={styles.seguimientoTexto}>Seguimiento disponible</Text>
                    </View>
                )}
            </View>

            <View style={styles.verDetalleContainer}>
                <Text style={styles.verDetalleText}>
                    Tocá para ver detalles →
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export default function MisPedidos({ navigation, userRole }) {

    // Usar el store apropiado según el rol
    const usePedidos = userRole === 'cliente' ? 
        require('../../stores/clienteStore').default :
        require('../../stores/pedidoStore').default;
        
    const {
        misPedidos,
        loading,
        error,
        fetchMisPedidos,
        clearError
    } = usePedidos();

    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        fetchMisPedidos();
    }, []);

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [
                { text: 'OK', onPress: () => clearError() }
            ]);
        }
    }, [error]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchMisPedidos();
        setRefreshing(false);
    };

    const handleVerDetalle = (pedido) => {
        // Navegar al detalle apropiado según el rol
        const targetScreen = userRole === 'cliente' ? 'PedidoDetalleCliente' : 'PedidoDetalle';
        navigation.navigate(targetScreen, {
            pedidoId: pedido.id_pedido,
            pedido: pedido
        });
    };

    const renderPedido = ({ item }) => (
        <PedidoItem
            pedido={item}
            onVerDetalle={handleVerDetalle}
            userRole={userRole}
        />
    );

    if (loading && misPedidos.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando mis pedidos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mis Pedidos</Text>
                <Text style={styles.subtitle}>
                    {misPedidos.length} pedido{misPedidos.length !== 1 ? 's' : ''} 
                    {userRole === 'repartidor' ? ' asignado' : ''}
                    {misPedidos.length !== 1 && userRole === 'repartidor' ? 's' : ''}
                </Text>
            </View>

            <FlatList
                data={misPedidos}
                renderItem={renderPedido}
                keyExtractor={(item) => item?.id_pedido?.toString() || Math.random().toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#007AFF']}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No tenés pedidos asignados en este momento.
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}