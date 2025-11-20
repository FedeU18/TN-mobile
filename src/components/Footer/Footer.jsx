import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./FooterStyles";
import COLORS from "../../utils/colors";
import useAuthStore from "../../stores/authStore";

function Footer({ currentRoute }) {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  
  const isRepartidor = user?.rol?.toLowerCase() === 'repartidor';
  const isCliente = user?.rol?.toLowerCase() === 'cliente';

  // Opciones dinámicas según el rol
  const getMenuOptions = () => {
    if (isRepartidor) {
      return [
        { label: "Inicio", screen: "Dashboard", icon: "home", params: {} },
        {
          label: "Disponibles",
          screen: "PedidosDisponibles",
          icon: "search",
          params: {},
        },
        { label: "Mis Pedidos", screen: "MisPedidos", icon: "list", params: {} },
        { label: "Perfil", screen: "Perfil", icon: "person", params: {} },
      ];
    }
    
    if (isCliente) {
      return [
        { label: "Inicio", screen: "Dashboard", icon: "home", params: {} },
        { label: "Mis Pedidos", screen: "MisPedidos", icon: "list", params: {} },
        { label: "Perfil", screen: "Perfil", icon: "person", params: {} },
      ];
    }

    // Default
    return [
      { label: "Inicio", screen: "Dashboard", icon: "home", params: {} },
      { label: "Perfil", screen: "Perfil", icon: "person", params: {} },
    ];
  };

  const options = getMenuOptions();

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
            name={
              isActive(item.screen) ? `${item.icon}` : `${item.icon}-outline`
            }
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
