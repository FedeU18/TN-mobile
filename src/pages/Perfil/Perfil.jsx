import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './PerfilStyles';
import useAuthStore from '../../stores/authStore';
import COLORS from '../../utils/colors';
import api from '../../utils/api';
import EditarPerfilModal from '../../components/Perfil/EditarPerfilModal';
import CambiarContraseñaModal from '../../components/Perfil/CambiarContraseñaModal';

export default function Perfil({ navigation }) {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [loadingEstadisticas, setLoadingEstadisticas] = useState(false);

  const isRepartidor = user?.rol?.toLowerCase() === 'repartidor';
  const isCliente = user?.rol?.toLowerCase() === 'cliente';

  // Cargar datos completos del usuario
  useEffect(() => {
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
    return (user?.rol?.charAt(0).toUpperCase() + user?.rol?.slice(1).toLowerCase()) || 'Usuario';
  };

  const handleEditProfileSuccess = (updatedUser) => {
    setUserDetails(updatedUser);
    setTimeout(() => {
      fetchUserDetails();
    }, 500);
  };

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

  const fetchEstadisticas = async () => {
    if (!isRepartidor) return;
    
    try {
      setLoadingEstadisticas(true);
      const response = await api.get('/repartidores/estadisticas/me');
      setEstadisticas(response.data);
    } catch (error) {
      console.error('Error fetching estadísticas:', error);
    } finally {
      setLoadingEstadisticas(false);
    }
  };

  // Cargar estadísticas del repartidor
  useEffect(() => {
    if (isRepartidor && userDetails) {
      fetchEstadisticas();
    }
  }, [isRepartidor, userDetails]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>

      {/* Avatar y nombre */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {displayUser?.foto_perfil ? (
            <Image
              source={{ uri: displayUser.foto_perfil }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons name="person-circle" size={100} color={COLORS.primary} />
          )}
        </View>
        <Text style={styles.userName}>
          {displayUser?.nombre || 'Usuario'} {displayUser?.apellido || ''}
        </Text>
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
              <Text style={styles.statNumber}>
                {loadingEstadisticas ? '--' : (estadisticas?.entregasCompletadas || 0)}
              </Text>
              <Text style={styles.statLabel}>Entregas</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={28} color={COLORS.warning} />
              <Text style={styles.statNumber}>
                {loadingEstadisticas ? '--' : (estadisticas?.calificacionPromedio || 0).toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>Calificación</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={28} color={COLORS.primary} />
              <Text style={styles.statNumber}>
                {loadingEstadisticas ? '--' : `${estadisticas?.tiempoPromedioMinutos || 0}m`}
              </Text>
              <Text style={styles.statLabel}>Promedio</Text>
            </View>
          </View>
        </View>
      )}

      {/* Historial solo para repartidores */}
      {isRepartidor && (
        <View style={styles.historialSection}>
          <TouchableOpacity 
            style={styles.historialButton}
            onPress={() => navigation.navigate('HistorialEntregas')}
          >
            <Ionicons name="time" size={20} color={COLORS.primary} />
            <Text style={styles.historialButtonText}>Ver Historial de Entregas</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>
      )}

      {/* Historial solo para clientes */}
      {isCliente && (
        <View style={styles.historialSection}>
          <TouchableOpacity 
            style={styles.historialButton}
            onPress={() => navigation.navigate('HistorialEntregas')}
          >
            <Ionicons name="receipt" size={20} color={COLORS.primary} />
            <Text style={styles.historialButtonText}>Ver Historial de Pedidos</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        </View>
      )}

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={18} color={COLORS.primary} />
          <Text style={styles.settingsButtonText}>Configuración</Text>
        </TouchableOpacity> */}
      </View>

      {/* Botón cambiar contraseña */}
      <View style={styles.passwordButtonContainer}>
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => setShowChangePasswordModal(true)}
        >
          <Ionicons name="lock-closed" size={18} color={COLORS.primary} />
          <Text style={styles.changePasswordButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      {/* Botón logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      {/* Modal para editar perfil */}
      <EditarPerfilModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditProfileSuccess}
        userData={displayUser}
      />

      {/* Modal para cambiar contraseña */}
      <CambiarContraseñaModal
        visible={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />
      </ScrollView>
    </View>
  );
}
