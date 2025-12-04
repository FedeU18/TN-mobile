import React from 'react';
import styles from './HomeStyles';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../../i18n/i18n';
import COLORS from '../../utils/colors';

export default function Home({ navigation }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.heroSection}>
        <MaterialIcons name="inventory" size={80} color={COLORS.primary} />
        <Text style={styles.title}>Track Now</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      </View>

      {/* Botones */}
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