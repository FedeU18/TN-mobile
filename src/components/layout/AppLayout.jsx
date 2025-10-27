import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const AppLayout = ({ children }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});

export default AppLayout;
