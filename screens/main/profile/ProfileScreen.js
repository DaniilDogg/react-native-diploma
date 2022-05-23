import React, {
    useState,
    useEffect,
  } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../../firebase/firebase-config";

import { Profile } from "./Profile";
import { EditProfile } from "./EditProfile";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const ProfileScreen = (props) => {  
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName = {"Profile"}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
      />
    </Stack.Navigator>
  );
};
  //<EditProfileScreen {...props}/>