import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './PasswordInputStyles';

export default function PasswordInput({
  placeholder = 'Contraseña',
  value,
  onChangeText,
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.passwordInputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#BDBDBD"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!showPassword}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
      />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={togglePasswordVisibility}
      >
        <Ionicons
          name={showPassword ? 'eye' : 'eye-off'}
          size={24}
          color="#666"
        />
      </TouchableOpacity>
    </View>
  );
}
