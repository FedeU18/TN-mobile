import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './EditarPerfilModalStyles';
import { updateProfile } from '../../utils/userService';
import api from '../../utils/api';
import COLORS from '../../utils/colors';

export default function EditarPerfilModal({
  visible,
  onClose,
  onSuccess,
  userData,
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
  });
  const [loading, setLoading] = useState(false);
  const [fotoUri, setFotoUri] = useState(null);

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        email: userData.email || '',
        telefono: userData.telefono || '',
      });
      setFotoUri(userData.foto_perfil || null);
    }
  }, [visible, userData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return false;
    }
    if (!formData.apellido.trim()) {
      Alert.alert('Error', 'El apellido es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'El email es requerido');
      return false;
    }
    if (!formData.telefono.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'El email no es válido');
      return false;
    }

    // Validar teléfono (solo números y espacios)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.telefono)) {
      Alert.alert('Error', 'El teléfono solo debe contener números');
      return false;
    }

    return true;
  };

  const handleSelectPhoto = async () => {
    try {
      const ImagePicker = require('expo-image-picker');
      
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar una foto');
        return;
      }

      // Abrir galería
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6, // Reducir a 60% de calidad para minimizar tamaño
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFotoUri(asset.uri);
      }
    } catch (error) {
      console.error('Error al seleccionar foto:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);   
      let dataToSend = { ...formData };
      
      // Si hay una foto nueva, convertirla a base64 para enviarla como string dentro del JSON
      if (fotoUri && fotoUri !== userData?.foto_perfil) {
        try {
          const response = await fetch(fotoUri);
          const blob = await response.blob();
          
          const reader = new FileReader();
          
          await new Promise((resolve, reject) => {
            reader.onload = () => {
              const base64String = reader.result;
              dataToSend.foto_perfil = base64String;
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (photoError) {
          console.error('❌ Error procesando foto:', photoError);
          Alert.alert('Error', 'No se pudo procesar la foto');
          setLoading(false);
          return;
        }
      }
      
      const response = await updateProfile(dataToSend);

      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      onSuccess && onSuccess(response.user);
      onClose();
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      
      let errorMessage = 'No se pudo actualizar el perfil';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons
                name="close"
                size={28}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Nombre */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nombre</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChangeText={(value) => handleInputChange('nombre', value)}
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>
            </View>

            {/* Apellido */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Apellido</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tu apellido"
                  value={formData.apellido}
                  onChangeText={(value) => handleInputChange('apellido', value)}
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="tu.email@ejemplo.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>
            </View>

            {/* Teléfono */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="call"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tu número telefónico"
                  value={formData.telefono}
                  onChangeText={(value) => handleInputChange('telefono', value)}
                  keyboardType="phone-pad"
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                />
              </View>
            </View>

            {/* Foto de Perfil */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Foto de Perfil</Text>
              <TouchableOpacity
                style={styles.photoSelector}
                onPress={handleSelectPhoto}
                disabled={loading}
              >
                {fotoUri ? (
                  <>
                    <Image
                      source={{ uri: fotoUri }}
                      style={styles.photoPreview}
                    />
                    <View style={styles.photoEditOverlay}>
                      <Ionicons name="pencil" size={24} color="#fff" />
                    </View>
                  </>
                ) : (
                  <>
                    <Ionicons name="image" size={40} color={COLORS.primary} />
                    <Text style={styles.photoPlaceholder}>Seleccionar Foto</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonCancel, loading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.buttonSave,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.buttonSaveText}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
