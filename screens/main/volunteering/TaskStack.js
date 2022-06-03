import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Text, Button, Tooltip } from "@rneui/base";

import { Task } from "./Task";
import { ChatScreen } from "./Chat";

import { auth, firestore } from "../../../firebase/firebase-config";
import {
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  query,
  where,
  doc,
  get,
  getDoc,
} from "firebase/firestore";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const TaskStack = (props) => {
  //In App stack
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
          title: props.route.params.title,
        })}
        initialParams={{
          title: props.route.params.title,
          key: props.route.params.key,
          task_id: props.route.params.task_id,
          userId: props.route.params.userId,
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
