import React, { useState } from 'react';
import styles from './ResetPasswordStyles';
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
import { validateResetPassword } from '../../utils/validations';
import useAuthStore from '../../stores/authStore';

export default function ResetPassword({ navigation, route }) {
  const [form, setForm] = useState({
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const { resetPassword, isLoading, error, clearError, successMessage, clearSuccessMessage } = useAuthStore();
  const { email } = route.params || {};

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    clearError();
    clearSuccessMessage();
    
    const validation = validateResetPassword(form);
    if (!validation.isValid) {
      Alert.alert("Error", validation.message);
      return;
    }
    
    const result = await resetPassword(form.token, form.newPassword);
    
    if (result.success) {
      Alert.alert(
        "Éxito", 
        "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate('Login')
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
          <Text style={styles.title}>Restablecer Contraseña</Text>
          
          <Text style={styles.subtitle}>
            {email ? `Se envió un código a ${email}. ` : ''}
            Ingresá el código de recuperación y tu nueva contraseña.
          </Text>
          
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}
          
          <TextInput
            style={styles.input}
            placeholder="Código de recuperación"
            placeholderTextColor="#9CA3AF"
            value={form.token}
            onChangeText={(text) => handleChange('token', text)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            placeholderTextColor="#9CA3AF"
            value={form.newPassword}
            onChangeText={(text) => handleChange('newPassword', text)}
            secureTextEntry={true}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar nueva contraseña"
            placeholderTextColor="#9CA3AF"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
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
              {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkText}>
              ¿No recibiste el código? Intentar nuevamente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonBack} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Volver a iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}