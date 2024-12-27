import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import SessionSetupScreen from './screens/SessionSetupScreen';
import SessionScreen from './screens/SessionScreen';
import SessionResultsScreen from './screens/SessionResultsScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="SessionSetup" component={SessionSetupScreen} />
        <Stack.Screen name="Session" component={SessionScreen} />
        <Stack.Screen name="SessionResults" component={SessionResultsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;
