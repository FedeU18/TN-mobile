import React, { useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    Animated
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import io from 'socket.io-client';
import styles from './MisPedidosStyles';
import useAuthStore from '../../stores/authStore';
import COLORS from '../../utils/colors';

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

export default function MisPedidos({ navigation, route }) {
    // Obtener el rol del usuario del authStore
    const { user } = useAuthStore();
    const userRole = user?.rol?.toLowerCase();
    
    // También intentar obtener de route.params como fallback
    const routeUserRole = route?.params?.userRole;
    const finalUserRole = userRole || routeUserRole;
    

    // Usar el store apropiado según el rol
    const usePedidos = finalUserRole === 'cliente' ? 
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

    // Recargar pedidos cuando vuelves a la pantalla
    useFocusEffect(
        React.useCallback(() => {
            fetchMisPedidos();
        }, [fetchMisPedidos])
    );

    // Escuchar cambios de estado en tiempo real
    useEffect(() => {
        const socket = io(
            process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000",
            { transports: ["websocket"] }
        );

        socket.on("connect", () => {
        });

        socket.on("estadoActualizado", (data) => {
            // Refrescar la lista cuando cambia un estado
            fetchMisPedidos();
        });

        socket.on("disconnect", () => {
        });

        socket.on("error", (error) => {
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchMisPedidos]);

    useEffect(() => {
        if (error) {
            // Solo mostrar alert si es un error real, no si es "no hay pedidos"
            const esErrorReal = !error.toLowerCase().includes('no hay') && 
                               !error.toLowerCase().includes('sin pedidos') &&
                               !error.toLowerCase().includes('sin repartos') &&
                               error.trim() !== '';
            
            if (esErrorReal) {
                Alert.alert('Error', error, [
                    { text: 'OK', onPress: () => clearError() }
                ]);
            } else {
                // Limpiar error silenciosamente si es solo "no hay pedidos"
                clearError();
            }
        }
    }, [error]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchMisPedidos();
        setRefreshing(false);
    };

    const handleVerDetalle = (pedido) => {
        // Usar la misma pantalla pero pasar el rol del usuario
        navigation.navigate('PedidoDetalle', {
            pedidoId: pedido.id_pedido,
            pedido: pedido,
            userRole: finalUserRole
        });
    };

    const renderPedido = ({ item }) => (
        <PedidoItem
            pedido={item}
            onVerDetalle={handleVerDetalle}
            userRole={finalUserRole}
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
            <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
                <View style={styles.headerContent}>
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>
                            Mis Pedidos
                        </Text>
                    </View>
                </View>
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