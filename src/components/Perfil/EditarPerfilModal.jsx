import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Alert,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./EditarPerfilModalStyles";
import { updateProfile } from "../../utils/userService";
import COLORS from "../../utils/colors";

export default function EditarPerfilModal({
  visible,
  onClose,
  onSuccess,
  userData,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [loading, setLoading] = useState(false);
  const [fotoUri, setFotoUri] = useState(null);

  const CLOUD_NAME = "dlqqalmj4"; // 👈 Cambia si es distinto
  const UPLOAD_PRESET = "tracknow";

  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData.nombre || "",
        apellido: userData.apellido || "",
        email: userData.email || "",
        telefono: userData.telefono || "",
      });
      setFotoUri(userData.foto_perfil || null);
    }
  }, [visible, userData]);

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return false;
    }
    if (!formData.apellido.trim()) {
      Alert.alert("Error", "El apellido es requerido");
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert("Error", "El email es requerido");
      return false;
    }
    if (!formData.telefono.trim()) {
      Alert.alert("Error", "El teléfono es requerido");
      return false;
    }
    return true;
  };

  const handleSelectPhoto = async () => {
    try {
      const ImagePicker = require("expo-image-picker");

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setFotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar foto:", error);
      Alert.alert("Error", "No se pudo seleccionar la foto");
    }
  };

  // 🔵 SUBIDA A CLOUDINARY
  const uploadToCloudinary = async (uri) => {
    try {
      const file = await fetch(uri);
      const blob = await file.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) return data.secure_url;

      console.log("Cloudinary error:", data);
      throw new Error("Error subiendo imagen");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw err;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let dataToSend = { ...formData };

      // ⬆️ SUBIR FOTO SOLO SI FUE CAMBIADA
      if (fotoUri && fotoUri !== userData?.foto_perfil) {
        try {
          const formDataImg = new FormData();

          formDataImg.append("file", {
            uri: fotoUri,
            type: "image/jpeg",
            name: "profile.jpg",
          });

          formDataImg.append("upload_preset", "tracknow");

          const cloudinaryRes = await fetch(
            "https://api.cloudinary.com/v1_1/dlqqalmj4/image/upload",
            {
              method: "POST",
              body: formDataImg,
            }
          );

          const data = await cloudinaryRes.json();

          if (!data.secure_url) {
            throw new Error("Error subiendo la imagen a Cloudinary");
          }

          dataToSend.foto_perfil = data.secure_url;
        } catch (err) {
          console.error("Cloudinary upload error:", err);
          Alert.alert("Error", "No se pudo subir la imagen");
          setLoading(false);
          return;
        }
      }

      // ⬆️ Actualizar perfil en tu backend
      const response = await updateProfile(dataToSend);

      Alert.alert("Éxito", "Perfil actualizado correctamente");
      onSuccess && onSuccess(response.user);
      onClose();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      let errorMessage = "No se pudo actualizar el perfil";
      if (error.response?.data?.message)
        errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity onPress={onClose} disabled={loading}>
              <Ionicons name="close" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

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
                  value={formData.nombre}
                  onChangeText={(v) => handleInputChange("nombre", v)}
                  editable={!loading}
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
                  value={formData.apellido}
                  onChangeText={(v) => handleInputChange("apellido", v)}
                  editable={!loading}
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
                  value={formData.email}
                  onChangeText={(v) => handleInputChange("email", v)}
                  keyboardType="email-address"
                  editable={!loading}
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
                  value={formData.telefono}
                  onChangeText={(v) => handleInputChange("telefono", v)}
                  keyboardType="phone-pad"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Foto */}
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
                    <Text style={styles.photoPlaceholder}>
                      Seleccionar Foto
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonCancel, loading && styles.buttonDisabled]}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonSave, loading && styles.buttonDisabled]}
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
