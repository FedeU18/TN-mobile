import React from 'react';
import styles from './HomeStyles';
import { View, Text, TouchableOpacity} from 'react-native';
import { useTranslation } from '../../i18n/i18n';

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
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation && navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>{t('home.login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation && navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>{t('home.register')}</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}