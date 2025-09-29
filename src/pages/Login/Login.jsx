import React, { useState, useEffect } from 'react';
import styles from './LoginStyles';
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
import { validateLogin } from '../../utils/validations';
import useAuthStore from '../../stores/authStore';

export default function Login({ navigation, route }) {
  const [form, setForm] = useState({ email: "", password: "" });
  
  const { login, isLoading, error, token, clearError, successMessage, registeredEmail, clearSuccessMessage } = useAuthStore();

  useEffect(() => {
    if (successMessage && registeredEmail) {
      setForm(prev => ({ ...prev, email: registeredEmail }));
      setTimeout(() => {
        clearSuccessMessage();
      }, 5000);
    }
  }, [successMessage, registeredEmail, clearSuccessMessage]);

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  // Redirigir según el rol del usuario
  const redirectByRole = (user) => {
    const userRole = user.rol.toLowerCase();
    switch (userRole) {
      case 'cliente':
        navigation.navigate('ClienteDashboard');
        break;
      case 'repartidor':
        navigation.navigate('RepartidorDashboard');
        break;
      case 'admin':
        navigation.navigate('AdminDashboard');
        break;
      default:
        navigation.navigate('Home');
        break;
    }
  };

  const handleSubmit = async () => {
    clearError();
    
    const validation = validateLogin(form);
    if (!validation.isValid) {
      Alert.alert("Error", validation.message);
      return;
    }
    
    const result = await login(form.email, form.password);
    
    if (result.success && result.user) {
      redirectByRole(result.user);
    } else {
      Alert.alert("Error", result.error);
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={form.email}
            onChangeText={(text) => handleChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#9CA3AF"
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
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
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.linkText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Volver al menú principal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

