import React, { useState, useEffect } from "react";
import styles from "./LoginStyles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { validateLogin } from "../../utils/validations";
import useAuthStore from "../../stores/authStore";
import COLORS from "../../utils/colors";

export default function Login({ navigation, route }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const {
    login,
    isLoading,
    error,
    token,
    clearError,
    successMessage,
    registeredEmail,
    clearSuccessMessage,
  } = useAuthStore();

  useEffect(() => {
    if (successMessage && registeredEmail) {
      setForm((prev) => ({ ...prev, email: registeredEmail }));
      setTimeout(() => {
        clearSuccessMessage();
      }, 5000);
    }
  }, [successMessage, registeredEmail, clearSuccessMessage]);

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Mapa de roles a pantallas
  const roleScreenMap = new Map([
    ["cliente", "ClienteDashboard"],
    ["repartidor", "RepartidorDashboard"],
  ]);

  // Redirigir según el rol del usuario
  const redirectByRole = (user) => {
    const userRole = user.rol.toLowerCase();
    const targetScreen = roleScreenMap.get(userRole) || "Home";
    navigation.replace(targetScreen);
  };

  const handleSubmit = async () => {
    clearError();

    const validation = validateLogin(form);
    if (!validation.isValid) {
      Alert.alert("Error", validation.message);
      return;
    }

    const result = await login(form.email, form.password);

    if (result.success) {
      // Validar que el rol sea cliente o repartidor
      const userRole = result.user?.rol?.toLowerCase();
      
      if (userRole === 'admin' || userRole === 'vendedor') {
        // Hacer logout automáticamente
        useAuthStore.getState().logout();
        
        Alert.alert(
          "Acceso no permitido",
          "Los administradores y vendedores deben usar la versión web de la aplicación.",
          [{ text: "OK" }]
        );
        return;
      }

      navigation.replace("Dashboard");
    } else {
      Alert.alert(
        "Error",
        result.error || "Error desconocido al iniciar sesión"
      );
    }
  };

  // Si ya hay token, redirigir al dashboard correspondiente
  React.useEffect(() => {
    if (token && useAuthStore.getState().user) {
      const user = useAuthStore.getState().user;
      redirectByRole(user);
    }
  }, [token, navigation]);

  if (token) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Redirigiendo...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <MaterialIcons name="inventory" size={60} color={COLORS.primary} />
          <Text style={styles.heroTitle}>Track Now</Text>
          <Text style={styles.heroSubtitle}>Tu solución de seguimiento de paquetes</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          {successMessage && registeredEmail ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#BDBDBD"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#BDBDBD"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.buttonBackText}>Volver al menú principal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
