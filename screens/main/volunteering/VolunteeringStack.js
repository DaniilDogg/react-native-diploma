import React from "react";
import { StyleSheet, View, TouchableHighlight } from "react-native";

import { Icon, Text, Button } from "@rneui/base";

import { TaskList } from "./TaskList";
import { VolunteeringList } from "./VolunteeringList";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export const Volunteering = (props) => {
  //props.navigation.closeDrawer();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VolunteeringList"
        component={VolunteeringList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TaskList"
        component={TaskList}
        options={(props) => ({
          title: props.route.params.text,
          header: () => (
            <View
              style={{
                height: 55,
                alignItems: "center",
                flexDirection: "row",
                backgroundColor: "#FFE5CD",
              }}
            >
              <Button
                icon={
                  <Icon
                    name="arrow-left"
                    type="material-community"
                    color="#000"
                    size={24}
                  />
                }
                onPress={() => props.navigation.goBack()}
                buttonStyle={{
                  backgroundColor: "",
                  paddingLeft: 12,
                  paddingRight: 12,
                  height: "100%",
                  borderRadius: 0,
                }}
              />
              <View style={{ alignItems: "center", marginLeft: 20 }}>
                <Text style={{ fontSize: 19, fontWeight: "normal" }}>
                  {props.route.params.volunteering_type}
                </Text>
              </View>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

/*
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { TaskList } from "./TaskList";
import { ChatScreen } from "./Chat";

const Tab = createMaterialTopTabNavigator();

export const TabScreen = () => {
  return (
    <Tab.Navigator
    tabBarOptions={{
      pressColor: 'transparent',
      pressOpacity: 1,
      labelStyle: {
        fontSize: 16,
        textTransform: 'none',
      },
      style: {
        backgroundColor: '#FFE5CD',
        height: 'auto',
        elevation: 0,
      },
      indicatorStyle: {
        backgroundColor: "#C08F61",
        height: 4,
        borderTopLeftRadius: 900,
        borderTopRightRadius: 900,
      },
    }}
    screenOptions={{
      tabBarScrollEnabled: true,
    }}
    >
      <Tab.Screen
        name="Tasks1"
        component={TaskList}
        initialParams={{ text: "ASDFG" }}
      />
      <Tab.Screen
        name="Автоволонтерство"
        component={TaskList}
        initialParams={{ text: "ZXCVB" }}
      />
      <Tab.Screen
        name="Фінансова допомога"
        component={TaskList}
        initialParams={{ text: "ZXCVB" }}
      />
    </Tab.Navigator>
  );
};
*/
