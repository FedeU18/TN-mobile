import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import Home from './src/pages/Home/Home';
import Login from './src/pages/Login/Login';
import Register from './src/pages/Register/Register';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const navigation = {
    navigate: (screenName) => {
      setCurrentScreen(screenName);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <Login navigation={navigation} />;
      case 'Register':
        return <Register navigation={navigation} />;
      case 'Home':
      default:
        return <Home navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
