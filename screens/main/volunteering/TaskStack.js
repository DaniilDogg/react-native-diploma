import React, { useState, useEffect } from "react";
import { StyleSheet, View, DeviceEventEmitter } from "react-native";
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
          headerRight: () => {
            const [added, setAdded] = useState(null)
            useEffect(()=>{
              const subscription = DeviceEventEmitter.addListener(
                "event.taskAdded",
                async (eventData) => {
                  setLocation(eventData);
                }
              );
              return () => {
                subscription.remove();
                DeviceEventEmitter.removeAllListeners("event.location");
              };
            }, [])

            if(added == null) return
            return (
              <Button
                icon={
                  //<ion-icon name=></ion-icon>
                  <Icon
                    name={added ? "remove-circle-outline" : "add-circle-outline"}
                    type="ionicon"
                    color="#000"
                    size={32}
                  />
                }
                onPress={() => props.navigation.goBack()}
                buttonStyle={{
                  backgroundColor: "#FFA046",
                  paddingLeft: 12,
                  paddingRight: 12,
                  height: "100%",
                  borderRadius: 0,
                }}
              />
            );
          },
        })}
        initialParams={{
          title: props.route.params.title,
          key: props.route.params.key,
          task_id: props.route.params.task_id,
        }}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
};
