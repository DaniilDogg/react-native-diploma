import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { Task } from "./Task";
import { ChatScreen } from "./Chat";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const TaskStack = (props) => { //In App stack
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFA046",
        },
      }}
    >
      <Stack.Screen
        name="Task"
        component={Task}
        options={(props) => ({
          title: props.route.params.volunteering_type,
        })}
        initialParams={{
          title: props.route.params.title,
          volunteering_type: props.route.params.volunteering_type,
          task_id: props.route.params.task_id,
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
