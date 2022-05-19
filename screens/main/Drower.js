import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { CustomDrawer } from "./components/CustomDrower";

import { ProfileScreen } from "./ProfileScreen";
import { ChatScreen } from "./Chat";

import Ionicons from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

export const DrawerScreen = () => {
  return (
    <SafeAreaProvider>
      <Drawer.Navigator
        drawerContent={props => (<CustomDrawer {...props}/>)}
        initialRouteName = {"Chat"}
        screenOptions={{
          headerShown: true,
          swipeEnabled: false,
          headerStyle: {
            backgroundColor: '#FFA046',
          },
          drawerActiveBackgroundColor: '#FFE5CD',
          drawerActiveTintColor: '#000',
          drawerInactiveTintColor: '#000',
          drawerLabelStyle: {
            marginLeft: -10,
            fontSize: 15,
          },
        }}
      >
        <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
        />
        <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
        />
      </Drawer.Navigator>
    </SafeAreaProvider>
  );
};
//<Drawer.Screen name="Profile" />
//<Drawer.Screen name="Log Out"/>
