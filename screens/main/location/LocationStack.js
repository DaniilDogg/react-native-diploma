import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationFilterScreen } from "./LocationFilterScreen";
import { LocationList } from "./LocationList";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const LocationStack = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"LocationFilterScreen"}
    >
      <Stack.Screen
        name="LocationFilterScreen"
        component={LocationFilterScreen}
        initialParams={{location: ''}}
      />
      <Stack.Screen
        name="LocationList"
        component={LocationList}
      />
    </Stack.Navigator>
  );
};
