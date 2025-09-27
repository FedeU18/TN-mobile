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

export default function Register({ navigation }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    foto_perfil: "",
  });

  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setError("");

    // Validación simple
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      Alert.alert("Error", "Las contraseñas no coinciden");
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Registro</Text>
          
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
          
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            placeholderTextColor="#9CA3AF"
            value={form.telefono}
            onChangeText={(text) => handleChange('telefono', text)}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={styles.input}
            placeholder="URL Foto de Perfil (opcional)"
            placeholderTextColor="#9CA3AF"
            value={form.foto_perfil}
            onChangeText={(text) => handleChange('foto_perfil', text)}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

