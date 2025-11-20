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
import styles from './HistorialEntregasStyles';
import api from '../../utils/api';
import COLORS from '../../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import useAuthStore from '../../stores/authStore';

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
      console.error('Error al obtener historial:', error);
      if (error.response?.status === 404) {
        setEntregas([]);
      } else {
        Alert.alert('Error', 'No se pudo obtener el historial');
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

  const getNombrePersona = (item) => {
    if (isRepartidor) {
      return `${item.cliente?.nombre} ${item.cliente?.apellido}`;
    } else {
      return `${item.repartidor?.nombre} ${item.repartidor?.apellido}`;
    }
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.entregaCard}
      onPress={() => handleVerDetalles(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitle}>
          <Text style={styles.pedidoId}>Pedido #{item.id_pedido}</Text>
          <Text style={styles.clienteName}>
            {getNombrePersona(item)}
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

  if (loading && entregas.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 28 }} />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </View>

      {entregas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="inbox" size={64} color={COLORS.gray[300]} />
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
          renderItem={renderCard}
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
