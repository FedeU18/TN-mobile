import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n/i18n';

export default function Home({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Track Now</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation && navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>{t('home.register')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation && navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>{t('home.login')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4b5563',
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#3b82f6',
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
});