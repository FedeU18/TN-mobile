import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import Header from './src/components/Header/Header';
import Footer from './src/components/Footer/Footer';
import Home from './src/pages/Home/Home';
import Login from './src/pages/Login/Login';
import Register from './src/pages/Register/Register';
import ForgotPassword from './src/pages/ForgotPassword/ForgotPassword';
import ResetPassword from './src/pages/ResetPassword/ResetPassword';
import ClienteDashboard from './src/pages/ClienteDashboard/ClienteDashboard';
import RepartidorDashboard from './src/pages/RepartidorDashboard/RepartidorDashboard';
import AdminDashboard from './src/pages/AdminDashboard/AdminDashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [routeParams, setRouteParams] = useState({});

  const navigation = {
    navigate: (screenName, params = {}) => {
      setCurrentScreen(screenName);
      setRouteParams(params);
    }
  };

  const renderScreen = () => {
    const route = { params: routeParams };
    
    switch (currentScreen) {
      case 'Login':
        return <Login navigation={navigation} route={route} />;
      case 'Register':
        return <Register navigation={navigation} route={route} />;
      case 'ForgotPassword':
        return <ForgotPassword navigation={navigation} route={route} />;
      case 'ResetPassword':
        return <ResetPassword navigation={navigation} route={route} />;
      case 'ClienteDashboard':
        return <ClienteDashboard navigation={navigation} route={route} />;
      case 'RepartidorDashboard':
        return <RepartidorDashboard navigation={navigation} route={route} />;
      case 'AdminDashboard':
        return <AdminDashboard navigation={navigation} route={route} />;
      case 'Home':
      default:
        return <Home navigation={navigation} route={route} />;
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
