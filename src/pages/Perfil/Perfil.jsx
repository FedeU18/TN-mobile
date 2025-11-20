import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './PerfilStyles';
import useAuthStore from '../../stores/authStore';
import COLORS from '../../utils/colors';
import api from '../../utils/api';

export default function Perfil({ navigation }) {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const isRepartidor = user?.rol?.toLowerCase() === 'repartidor';
  const isCliente = user?.rol?.toLowerCase() === 'cliente';

  // Cargar datos completos del usuario
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/users/me');
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  // Usar userDetails (data del servidor) si están disponibles, sino usar user (data cacheada local)
  const displayUser = userDetails || user;

  const handleLogout = () => {
    Alert.alert('Confirmar', '¿Deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        onPress: () => {
          logout();
        },
        style: 'destructive',
      },
    ]);
  };

  const getRoleLabel = () => {
    if (isRepartidor) return 'Repartidor';
    if (isCliente) return 'Cliente';
    return 'Usuario';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>

      {/* Avatar y nombre */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color={COLORS.primary} />
        </View>
        <Text style={styles.userName}>{displayUser?.nombre || 'Usuario'}</Text>
        <Text style={styles.userRole}>{getRoleLabel()}</Text>
      </View>

      {/* Información del usuario */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{displayUser?.email || 'No disponible'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Teléfono</Text>
              <Text style={styles.infoValue}>{displayUser?.telefono || 'No disponible'}</Text>
            </View>
          </View>
        </View>

        {isCliente && (
          <>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="map" size={20} color={COLORS.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Dirección</Text>
                  <Text style={styles.infoValue}>{displayUser?.direccion || 'No disponible'}</Text>
                </View>
              </View>
            </View>

            {displayUser?.ciudad && (
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="location" size={20} color={COLORS.primary} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Ciudad</Text>
                    <Text style={styles.infoValue}>{displayUser.ciudad}</Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        {isRepartidor && (
          <>
            {displayUser?.estado && (
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Estado</Text>
                    <Text style={[styles.infoValue, { color: COLORS.success }]}>
                      {displayUser.estado}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Estadísticas solo para repartidores */}
      {isRepartidor && (
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Estadísticas</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-done" size={28} color={COLORS.success} />
              <Text style={styles.statNumber}>--</Text>
              <Text style={styles.statLabel}>Entregas</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={28} color={COLORS.warning} />
              <Text style={styles.statNumber}>--</Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={28} color={COLORS.primary} />
              <Text style={styles.statNumber}>--</Text>
              <Text style={styles.statLabel}>Promedio</Text>
            </View>
          </View>
        </View>
      )}

      {/* Historial solo para repartidores */}
      {isRepartidor && (
        <View style={styles.historialSection}>
          <TouchableOpacity style={styles.historialButton}>
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.historialButtonText}>Ver Historial de Entregas</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={18} color={COLORS.primary} />
          <Text style={styles.settingsButtonText}>Configuración</Text>
        </TouchableOpacity>
      </View>

      {/* Botón logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
