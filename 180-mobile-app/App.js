import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import MeetingDetailScreen from './src/screens/MeetingDetailScreen';
import LoginScreen from './src/screens/LoginScreen';
import AddMeetingScreen from './src/screens/AddMeetingScreen';
import ResponsesScreen from './src/screens/ResponsesScreen';

export const AuthContext = createContext();
const Stack = createNativeStackNavigator();

export default function App() {
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) setUserToken(token);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const authContext = {
    userToken,
    login: async (token) => {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
    },
    logout: async () => {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    },
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#FAFAFA' },
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MeetingDetail" component={MeetingDetailScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="AddMeeting" component={AddMeetingScreen} />
          <Stack.Screen name="Responses" component={ResponsesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}