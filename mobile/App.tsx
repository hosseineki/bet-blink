import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import GameScreen from './src/screens/GameScreen';
import ProtectedRoute from './src/components/ProtectedRoute';

// Define the navigation parameter types
export type RootStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  Game: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Main App Navigator
function AppNavigator(): React.JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <></>; // Loading is handled by ProtectedRoute
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Dashboard" : "Welcome"}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#1a1a2e' }
      }}
    >
      {/* Public Routes */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />

      {/* Protected Routes */}
      <Stack.Screen name="Dashboard">
        {(props) => (
          <ProtectedRoute>
            <DashboardScreen {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>
      <Stack.Screen name="Game">
        {(props) => (
          <ProtectedRoute>
            <GameScreen {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

// Main App Component
export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#1a1a2e" />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
