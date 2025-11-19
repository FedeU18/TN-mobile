import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './FooterStyles';
import COLORS from '../../utils/colors';

function Footer({ currentRoute, navigation }) {
  const options = [
    { label: 'Dashboard', screen: 'Dashboard', icon: 'home', params: {} },
    { label: 'Pedidos', screen: 'MisPedidos', icon: 'list', params: {} },
    { label: 'Disponibles', screen: 'PedidosDisponibles', icon: 'search', params: {} },
  ];

  const isActive = (screen) => currentRoute === screen;

  const handleNavigation = (screen, params) => {
    if (navigation) {
      navigation.navigate(screen, params);
    }
  };

  return (
    <View style={styles.footer}>
      {options.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.menuItem,
            isActive(item.screen) && styles.menuItemActive,
          ]}
          onPress={() => handleNavigation(item.screen, item.params)}
        >
          <Ionicons
            name={isActive(item.screen) ? `${item.icon}` : `${item.icon}-outline`}
            size={24}
            color={isActive(item.screen) ? COLORS.primary : COLORS.gray[600]}
            style={styles.menuIcon}
          />
          <Text
            style={[
              styles.menuLabel,
              isActive(item.screen) && styles.menuLabelActive,
            ]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Footer;