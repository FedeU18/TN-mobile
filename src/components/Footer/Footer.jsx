import React from 'react';
import { View, Text} from 'react-native';
import styles from './FooterStyles';

function Footer() {
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