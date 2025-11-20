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
import { Ionicons } from '@expo/vector-icons';
import styles from './HistorialPedidosStyles';
import api from '../../utils/api';
import COLORS from '../../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HistorialPedidos({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistorialPedidos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/pedidos/historial/pedidos');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al obtener historial de pedidos:', error);
      if (error.response?.status === 404) {
        setPedidos([]);
      } else {
        Alert.alert('Error', 'No se pudo obtener el historial de pedidos');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistorialPedidos();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistorialPedidos();
  };

  const handleVerDetalles = (pedido) => {
    navigation.navigate('PedidoDetalle', { pedido });
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return COLORS.success;
      case 'cancelado':
        return COLORS.error;
      default:
        return COLORS.gray[600];
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return 'checkmark-circle';
      case 'cancelado':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const renderPedidoCard = ({ item }) => (
    <TouchableOpacity
      style={styles.pedidoCard}
      onPress={() => handleVerDetalles(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.pedidoId}>Pedido #{item.id_pedido}</Text>
          <Text style={styles.repartidorName}>
            {item.repartidor?.nombre} {item.repartidor?.apellido}
          </Text>
        </View>
        <View
          style={[
            styles.estadoBadge,
            { backgroundColor: getEstadoColor(item.estado?.nombre_estado) },
          ]}
        >
          <Ionicons
            name={getEstadoIcon(item.estado?.nombre_estado)}
            size={16}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.estadoText}>
            {item.estado?.nombre_estado}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color={COLORS.gray[600]} />
          <Text style={styles.infoText}>{item.direccion_destino}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color={COLORS.gray[600]} />
          <Text style={styles.infoText}>
            {new Date(item.fecha_creacion).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {item.total && (
          <View style={styles.infoRow}>
            <Ionicons name="cash" size={16} color={COLORS.gray[600]} />
            <Text style={[styles.infoText, { fontWeight: '600' }]}>
              ${item.total.toLocaleString('es-CO')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.verDetalles}>Ver detalles</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={COLORS.primary}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading && pedidos.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Historial de Pedidos</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de Pedidos</Text>
        <View style={{ width: 28 }} />
      </View>

      {pedidos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="inbox" size={64} color={COLORS.gray[300]} />
          <Text style={styles.emptyTitle}>Sin pedidos completados</Text>
          <Text style={styles.emptyText}>
            Aún no tienes pedidos entregados en tu historial
          </Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          renderItem={renderPedidoCard}
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
