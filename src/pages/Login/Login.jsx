import React, { useState } from 'react';
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

export default function Login({ navigation }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [logeado, setLogeado] = useState(false);

  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (form.email === "" || form.password === "") {
      setError("Todos los campos son obligatorios");
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }
    setError("");
    setLogeado(true);
  };

  if (logeado) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Bienvenido, {form.email}</Text>
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
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

