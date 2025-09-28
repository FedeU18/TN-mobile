import React from 'react';
import { View, Text} from 'react-native';
import styles from './FooterStyles';

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>&copy; 2025 TrackNow. All rights reserved.</Text>
    </View>
  );
}

export default Footer;