import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

const AppLayout = ({ children, footer }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>{children}</View>
      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default AppLayout;
