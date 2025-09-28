import React, { useState } from 'react';
import styles from './RegisterStyles';
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
import { validateRegistrationStep1, validateRegistrationStep2 } from '../../utils/validations';

export default function Register({ navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    foto_perfil: "",
    //id_rol: "",
    //id_estado: ""
  });

  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const validateStep1 = () => {
    const validation = validateRegistrationStep1(form);
    if (!validation.isValid) {
      setError(validation.message);
      Alert.alert("Error", validation.message);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError("");
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setError("");
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    setError("");

    // Validación del paso 2
    const validation = validateRegistrationStep2(form);
    if (!validation.isValid) {
      setError(validation.message);
      Alert.alert("Error", validation.message);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Error al registrarse");
        Alert.alert("Error", data.message || "Error al registrarse");
      } else {
        Alert.alert("Éxito", "Registro exitoso", [
          { text: "OK", onPress: () => navigation.navigate("Login") }
        ]);
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      Alert.alert("Error", "Error de conexión con el servidor");
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Paso 1: Información personal</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#9CA3AF"
        value={form.nombre}
        onChangeText={(text) => handleChange('nombre', text)}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#9CA3AF"
        value={form.apellido}
        onChangeText={(text) => handleChange('apellido', text)}
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        placeholderTextColor="#9CA3AF"
        value={form.telefono}
        onChangeText={(text) => handleChange('telefono', text)}
        keyboardType="phone-pad"
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver al menú principal</Text>
      </TouchableOpacity>
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Paso 2: Datos de acceso</Text>
      
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
      
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#9CA3AF"
        value={form.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={handleBack}>
        <Text style={styles.buttonSecondaryText}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Volver al menú principal</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {currentStep === 1 ? renderStep1() : renderStep2()}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

