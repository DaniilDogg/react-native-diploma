import React, {
    useState,
    useEffect,
  } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profile } from "./Profile";
import { EditProfile } from "./EditProfile";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const ProfileScreen = (props) => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName = {"ProfileScreen"}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={Profile}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
      />
    </Stack.Navigator>
  );
};