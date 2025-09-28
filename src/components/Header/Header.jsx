import React from 'react';
import { View, Text} from 'react-native';
import styles from './HeaderStyles';

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>TrackNow</Text>
    </View>
  );
}

export default Header;