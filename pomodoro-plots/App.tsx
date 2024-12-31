import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import SessionHistoryScreen from './screens/session/SessionHistoryScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AccountScreen from './screens/AccountScreen';
import WorkoutHomeScreen from './screens/workout/WorkoutHomeScreen';
import SessionHomeScreen from './screens/session/SessionHomeScreen';
import SessionSetupScreen from './screens/session/SessionSetupScreen';
import SessionScreen from './screens/session/SessionScreen';
import SessionResultsScreen from './screens/session/SessionResultsScreen';
import CreateExerciseScreen from './screens/workout/CreateExerciseScreen';
import CreateWorkoutScreen from './screens/workout/CreateWorkoutScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          {/* Auth Stuff */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Sign Up" component={SignUpScreen} />

          {/* Misc Stuff */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />

          {/* Pomodoro Session Stuff */}
          <Stack.Screen name="SessionHome" component={SessionHomeScreen} />
          <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
          <Stack.Screen name="SessionSetup" component={SessionSetupScreen} />
          <Stack.Screen name="Session" component={SessionScreen} />
          <Stack.Screen name="SessionResults" component={SessionResultsScreen} />

          {/* Workout Stuff */}
          <Stack.Screen name="WorkoutHome" component={WorkoutHomeScreen} />
          <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
          <Stack.Screen name="CreateExercise" component={CreateExerciseScreen} />
          {/* <Stack.Screen name="PerformWorkout" component={PerformWorkoutScreen} /> */}
          {/* <Stack.Screen name="WorkoutHistory" component={WorkoutHistoryScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default MyStack;
