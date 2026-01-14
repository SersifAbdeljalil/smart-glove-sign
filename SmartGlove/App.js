/* ============================================
   FICHIER: App.js
   Composant racine avec React Navigation - React Native
   ============================================ */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import Home from './src/pages/Home';
import Dashboard from './src/pages/Dashboard';
import NotFound from './src/pages/NotFound';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#06141B" />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#06141B' }
          }}
        >
          {/* Route Page d'Accueil */}
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={{
              title: 'Smart Glove'
            }}
          />
          
          {/* Route Dashboard */}
          <Stack.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={{
              title: 'Dashboard',
              headerShown: true,
              headerStyle: {
                backgroundColor: '#0F172A',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: '700',
              },
            }}
          />
          
          {/* Route 404 - Page non trouvée */}
          <Stack.Screen 
            name="NotFound" 
            component={NotFound}
            options={{
              title: 'Page non trouvée'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;