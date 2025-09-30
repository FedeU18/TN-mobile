import React from 'react';
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();

function AppLayout({ children }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header />
      <View style={styles.content}>
        {children}
      </View>
      <Footer />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <AppLayout>
              <Home {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => (
            <AppLayout>
              <Login {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {(props) => (
            <AppLayout>
              <Register {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword">
          {(props) => (
            <AppLayout>
              <ForgotPassword {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ResetPassword">
          {(props) => (
            <AppLayout>
              <ResetPassword {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="ClienteDashboard">
          {(props) => (
            <AppLayout>
              <ClienteDashboard {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="RepartidorDashboard">
          {(props) => (
            <AppLayout>
              <RepartidorDashboard {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
        <Stack.Screen name="AdminDashboard">
          {(props) => (
            <AppLayout>
              <AdminDashboard {...props} />
            </AppLayout>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
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
