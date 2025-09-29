import React, { useState } from 'react';
import styles from './ForgotPasswordStyles';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { validateEmail } from '../../utils/validations';
import useAuthStore from '../../stores/authStore';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  
  const { forgotPassword, isLoading, error, clearError, successMessage, clearSuccessMessage } = useAuthStore();

  const handleSubmit = async () => {
    clearError();
    clearSuccessMessage();
    
    const validation = validateEmail(email);
    if (!validation.isValid) {
      Alert.alert("Error", validation.message);
      return;
    }
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      Alert.alert(
        "Éxito", 
        "Se envió un enlace de recuperación a tu correo electrónico. Revisa tu bandeja de entrada.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('ResetPassword', { email })
          }
        ]
      );
    } else {
      Alert.alert("Error", result.error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          
          <Text style={styles.subtitle}>
            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
          </Text>
          
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
              {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonBack} 
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}