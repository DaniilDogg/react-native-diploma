import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LocationFilterScreen } from "../location/LocationFilterScreen";
import { CreatedList } from "./createdList";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const CreateStack = (props) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={"CreatedList"}
    >
      <Stack.Screen
        name="CreatedList"
        component={CreatedList}
        initialParams={{location: ''}}
      />
      <Stack.Screen
        name="LocationList"
        component={CreatedList}
      />
    </Stack.Navigator>
  );
};