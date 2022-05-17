import React, { useState, useEffect, useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignInScreen } from "./screens/auth/sign-in";
import { SignUpScreen } from "./screens/auth/sign-up";
import { CreateAccountScreen } from "./screens/auth/create-account";
import { HomeScreen } from "./screens/main/home";
import { LogBox } from 'react-native';
import { auth } from "./firebase/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true)
  const [screen, setScreen] = useState('')

  LogBox.ignoreAllLogs()
  //LogBox.ignoreLogs([`AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage`]);
  const config = {
    animation: "spring",
    config: {
      stiffness: 500,
      damping: 250,
      mass: 1,
      overshootClamping: true,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
    },
  };
  useEffect(()=>{
    onAuthStateChanged(auth, (user)=>{
      if (user) {
        if(user.displayName != null){
          setScreen('HomeScreen')
        }
        else{
          setScreen('Create Account')
        }
      }
      else {
        setScreen('Sign In')
      }
      if(initializing) setInitializing(false)
    })
  }, [])
  

  if (initializing) return null;
  else{
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName = {screen}
          >
            <Stack.Screen
              name="Sign In"
              component={SignInScreen}
              options={{
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
            />
            <Stack.Screen
              name="Sign Up"
              component={SignUpScreen}
              options={{
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
            />
            <Stack.Screen
              name="Create Account"
              component={CreateAccountScreen}
              options={{
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{
                transitionSpec: {
                  open: {},
                  close: config,
                },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}