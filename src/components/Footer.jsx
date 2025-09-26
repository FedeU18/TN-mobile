import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>&copy; 2025 TrackNow. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1f2937',
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Footer;