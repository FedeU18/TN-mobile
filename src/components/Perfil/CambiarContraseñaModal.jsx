import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './CambiarContraseñaModalStyles';
import api from '../../utils/api';
import COLORS from '../../utils/colors';
import { validateRequired, validatePassword } from '../../utils/validations';

export default function CambiarContraseñaModal({
  visible,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    // Validar contraseña actual
    const currentPasswordValidation = validateRequired(
      formData.currentPassword,
      "Contraseña actual"
    );
    if (!currentPasswordValidation.isValid) {
      Alert.alert('Error', currentPasswordValidation.message);
      return false;
    }

    // Validar nueva contraseña
    const newPasswordValidation = validatePassword(formData.newPassword);
    if (!newPasswordValidation.isValid) {
      Alert.alert('Error', newPasswordValidation.message);
      return false;
    }

    // Validar que las contraseñas coincidan
    const requiredConfirmValidation = validateRequired(
      formData.confirmPassword,
      "Confirmar contraseña"
    );
    if (!requiredConfirmValidation.isValid) {
      Alert.alert('Error', requiredConfirmValidation.message);
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    // Validar que la nueva contraseña sea diferente a la actual
    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/users/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onSuccess && onSuccess();
      onClose();
    } catch (error) {

      let errorMessage = 'No se pudo cambiar la contraseña';
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

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
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
            <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            <TouchableOpacity onPress={handleClose} disabled={loading}>
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
            {/* Contraseña actual */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contraseña Actual</Text>
              <View style={styles.passwordInputContainer}>
                <Ionicons
                  name="lock"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tu contraseña actual"
                  value={formData.currentPassword}
                  onChangeText={(value) =>
                    handleInputChange('currentPassword', value)
                  }
                  secureTextEntry={!showPasswords.current}
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => toggleShowPassword('current')}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPasswords.current ? 'eye' : 'eye-off'}
                    size={20}
                    color={COLORS.gray[600]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Nueva contraseña */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nueva Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <Ionicons
                  name="lock"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tu nueva contraseña"
                  value={formData.newPassword}
                  onChangeText={(value) =>
                    handleInputChange('newPassword', value)
                  }
                  secureTextEntry={!showPasswords.new}
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => toggleShowPassword('new')}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPasswords.new ? 'eye' : 'eye-off'}
                    size={20}
                    color={COLORS.gray[600]}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar contraseña */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <Ionicons
                  name="lock"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu nueva contraseña"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange('confirmPassword', value)
                  }
                  secureTextEntry={!showPasswords.confirm}
                  editable={!loading}
                  placeholderTextColor={COLORS.gray[400]}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => toggleShowPassword('confirm')}
                  disabled={loading}
                >
                  <Ionicons
                    name={showPasswords.confirm ? 'eye' : 'eye-off'}
                    size={20}
                    color={COLORS.gray[600]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Botones */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonCancel, loading && styles.buttonDisabled]}
              onPress={handleClose}
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
