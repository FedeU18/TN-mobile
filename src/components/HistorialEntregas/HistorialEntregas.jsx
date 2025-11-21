import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from './HistorialEntregasStyles';
import api from '../../utils/api';
import COLORS from '../../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import useAuthStore from '../../stores/authStore';

const PedidoItem = ({ pedido, onVerDetalle, userRole }) => {
  const getEstadoColor = (estado) => {
    switch (estado?.nombre_estado) {
      case 'Pendiente':
        return '#ffc107';
      case 'Asignado':
        return '#007AFF';
      case 'En camino':
        return '#FF9500';
      case 'Entregado':
        return '#28a745';
      case 'Cancelado':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.pedidoCard}
      onPress={() => onVerDetalle(pedido)}
    >
      <View style={styles.pedidoHeader}>
        <Text style={styles.pedidoId}>Pedido #{pedido.id_pedido}</Text>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: getEstadoColor(pedido.estado) },
          ]}
        >
          <Text style={styles.estadoText}>
            {pedido.estado?.nombre_estado || 'Sin estado'}
          </Text>
        </View>
      </View>

      <View style={styles.pedidoInfo}>
        {userRole === 'repartidor' ? (
          <Text style={styles.cliente}>
            Cliente: {pedido.cliente?.nombre || 'Sin Nombre'}{' '}
            {pedido.cliente?.apellido || ''}
          </Text>
        ) : (
          <Text style={styles.repartidor}>
            Repartidor: {pedido.repartidor?.nombre || 'No asignado'}{' '}
            {pedido.repartidor?.apellido || ''}
          </Text>
        )}
        <Text style={styles.direccion}>Destino: {pedido.direccion_destino}</Text>
        <Text style={styles.fecha}>
          Creado: {formatearFecha(pedido.fecha_creacion)}
        </Text>
      </View>

      <View style={styles.verDetalleContainer}>
        <Text style={styles.verDetalleText}>Tocá para ver detalles →</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HistorialEntregas({ navigation }) {
  const { user } = useAuthStore();
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRepartidor = user?.rol?.toLowerCase() === 'repartidor';
  const endpoint = isRepartidor ? '/pedidos/historial/entregas' : '/pedidos/historial/pedidos';
  const title = isRepartidor ? 'Historial de Entregas' : 'Historial de Pedidos';

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoint);
      setEntregas(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // No hay historial, establecer array vacío sin mostrar error
        setEntregas([]);
      } else {
        // Solo mostrar alert para errores reales
        const mensajeError = error.response?.data?.message || error.message || '';
        if (!mensajeError.toLowerCase().includes('no se encontraron') && 
            !mensajeError.toLowerCase().includes('sin')) {
          Alert.alert('Error', 'No se pudo obtener el historial');
        } else {
          setEntregas([]);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistorial();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistorial();
  };

  const handleVerDetalles = (pedido) => {
    navigation.navigate('PedidoDetalle', { id: pedido.id_pedido });
  };

  const renderPedido = ({ item }) => (
    <PedidoItem
      pedido={item}
      onVerDetalle={handleVerDetalles}
      userRole={isRepartidor ? 'repartidor' : 'cliente'}
    />
  );

  if (loading && entregas.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>
                {isRepartidor ? 'Historial de Entregas' : 'Historial de Pedidos'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando {isRepartidor ? 'entregas' : 'pedidos'}...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {isRepartidor ? 'Historial de Entregas' : 'Historial de Pedidos'}
            </Text>
          </View>
        </View>
      </View>

      {entregas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="inbox" size={64} color={COLORS.gray[300]} />
          <Text style={styles.emptyTitle}>
            Sin {isRepartidor ? 'entregas' : 'pedidos'} completados
          </Text>
          <Text style={styles.emptyText}>
            Aún no tienes {isRepartidor ? 'entregas' : 'pedidos'} en tu historial
          </Text>
        </View>
      ) : (
        <FlatList
          data={entregas}
          renderItem={renderPedido}
          keyExtractor={(item) => item.id_pedido.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
