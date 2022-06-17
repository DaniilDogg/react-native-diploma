import React, { useState, useEffect, useLayoutEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Platform } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SignInScreen } from "./screens/auth/SignIn";
import { SignUpScreen } from "./screens/auth/SignUp";
import { CreateAccountScreen } from "./screens/auth/CreateAccount";
import { TaskStack } from "./screens/main/task/TaskStack";

import { DrawerScreen } from "./screens/main/drawer/Drawer";

import { LogBox } from 'react-native';
import { auth, firestore } from "./firebase/firebase-config";

import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
} from "firebase/firestore";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true)
  const [screen, setScreen] = useState('')
  const [admin, setAdmin] = useState(null)
  LogBox.ignoreAllLogs()
  
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
    onAuthStateChanged(auth, async (user)=>{
      if (user) {
        if(user.displayName != null){
          const docRef = doc(firestore, "users", user.uid);
          const data = await getDoc(docRef);
          setAdmin(data.data().admin)
          setScreen('DrawerScreen')
        }
        else{
          setScreen('CreateAccount')
        }
      }
      else {
        setScreen('Sign In')
      }
      if(initializing) setInitializing(false)
    })
  }, [])  

  if (initializing) return null;
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
              title: 'Вхід',
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
              title: 'Реєстрація',
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
            }}
          />
          <Stack.Screen
            name="DrawerScreen"
            component={DrawerScreen}
            initialParams={{
              isAdmin: admin,
            }}
            options={{
              transitionSpec: {
                open: {},
                close: config,
              },
            }}
          />
          <Stack.Screen
            name="TaskStack"
            component={TaskStack}
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