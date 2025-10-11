import React, { useState } from "react";
import styles from "./ForgotPasswordStyles";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { validateEmail } from "../../utils/validations";
import useAuthStore from "../../stores/authStore";

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const {
    forgotPassword,
    isLoading,
    error,
    clearError,
    successMessage,
    clearSuccessMessage,
  } = useAuthStore();

  // Limpiar mensajes al entrar a la pantalla
  React.useEffect(() => {
    clearError();
    clearSuccessMessage();
  }, [clearError, clearSuccessMessage]);

  const handleSubmit = async () => {
    try {
      clearError();
      clearSuccessMessage();
      setValidationError("");

      const validation = validateEmail(email);
      if (!validation.isValid) {
        setValidationError(validation.message);
        return;
      }

      const result = await forgotPassword(email);

      if (result && result.success) {
        navigation.navigate("ResetPassword", { email });

        setTimeout(() => {
          Alert.alert(
            "Éxito",
            "Se envió un código de recuperación a tu correo electrónico. Revisa tu bandeja de entrada."
          );
        }, 100);
      } else {
        setValidationError(
          result?.error || "Error al enviar el enlace de recuperación"
        );
      }
    } catch (error) {
      setValidationError("Error inesperado. Por favor intenta nuevamente.");
    }
  };

  try {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Recuperar Contraseña</Text>

              <Text style={styles.subtitle}>
                Ingresá tu email y te enviaremos un enlace para restablecer tu
                contraseña.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (validationError) {
                    setValidationError("");
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {error || validationError ? (
                <Text style={styles.errorText}>{validationError || error}</Text>
              ) : null}

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonBack}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } catch (renderError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.errorText}>
            Ha ocurrido un error inesperado. Por favor reinicia la aplicación.
          </Text>
          <TouchableOpacity
            style={styles.buttonBack}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
