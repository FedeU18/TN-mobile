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
  const [step, setStep] = useState(1); // 1: Verificar token, 2: Cambiar contraseña
  const [validationError, setValidationError] = useState('');
  
  const { verifyResetToken, resetPassword, isLoading, error, clearError, successMessage, clearSuccessMessage } = useAuthStore();
  const { email } = route.params || {};

  React.useEffect(() => {
    clearError();
    clearSuccessMessage();
    setForm({
      token: '',
      newPassword: '',
      confirmPassword: ''
    });
    setStep(1);
    setValidationError('');
  }, [clearError, clearSuccessMessage]);

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
    if (validationError) {
      setValidationError('');
    }
  };

  const handleVerifyToken = async () => {
    clearError();
    clearSuccessMessage();
    setValidationError('');
    
    if (!form.token.trim()) {
      setValidationError("Por favor ingresa el código de recuperación");
      return;
    }
    
    const result = await verifyResetToken(form.token);
    
    if (result.success && result.valid) {
      setStep(2);
      setValidationError('');
      setForm(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));
    } else {
      setValidationError(result.error || "Error al verificar el código");
    }
  };

  const handleResetPassword = async () => {
    clearError();
    clearSuccessMessage();
    setValidationError('');
    
    const validation = validateResetPassword(form);
    if (!validation.isValid) {
      setValidationError(validation.message);
      return;
    }
    
    const result = await resetPassword(form.token, form.newPassword);
    
    if (result.success) {
      clearSuccessMessage();
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      
      setTimeout(() => {
        Alert.alert(
          "Éxito", 
          "Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña."
        );
      }, 100);
    } else {
      setValidationError(result.error || "Error al cambiar la contraseña");
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
            {step === 1 ? (
              email ? 
                `Se envió un código a ${email}. Ingresa el código de recuperación para continuar.` : 
                'Ingresa el código de recuperación que recibiste por email.'
            ) : (
              'Código verificado. Ahora establece tu nueva contraseña.'
            )}
          </Text>
          

          
          {step === 1 ? (
            <TextInput
              style={styles.input}
              placeholder="Código de recuperación"
              placeholderTextColor="#9CA3AF"
              value={form.token}
              onChangeText={(text) => handleChange('token', text)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          ) : (
            <View style={styles.tokenConfirmed}>
              <Text style={styles.tokenConfirmedText}>Código verificado, ingrese su nueva contraseña</Text>
            </View>
          )}

          {step === 2 && (
            <>
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

              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>La contraseña debe contener:</Text>
                <Text style={styles.requirementItem}>• Al menos 6 caracteres</Text>
                <Text style={styles.requirementItem}>• Al menos un número</Text>
                <Text style={styles.requirementItem}>• Al menos una letra</Text>
                <Text style={styles.requirementItem}>• Al menos un carácter especial (como ! o &)</Text>
              </View>

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
            </>
          )}

          {(error || validationError) ? (
            <Text style={styles.errorText}>{validationError || error}</Text>
          ) : null}
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={step === 1 ? handleVerifyToken : handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 
                (step === 1 ? 'Verificando...' : 'Restableciendo...') : 
                (step === 1 ? 'Verificar código' : 'Restablecer contraseña')
              }
            </Text>
          </TouchableOpacity>

          {step === 1 && (
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.linkText}>
                ¿No recibiste el código? Volver a solicitar
              </Text>
            </TouchableOpacity>
          )}

          {step === 2 && (
            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => setStep(1)}
            >
              <Text style={styles.linkText}>
                ¿Código incorrecto? Volver a ingresarlo
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.buttonBack} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}