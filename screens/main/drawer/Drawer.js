import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@rneui/base";

import { CustomDrawer } from "./CustomDrawer";

import { ProfileScreen } from "../profile/ProfileScreen";
import { ChatScreen } from "../task/Chat";
import { Volunteering } from "../volunteering/VolunteeringStack";
import { LocationStack } from "../location/LocationStack";
import { FavoritesList } from "../favorites/FavoritesList";

import Ionicons from "react-native-vector-icons/Ionicons";

const Drawer = createDrawerNavigator();

export const DrawerScreen = () => {
  return (
    <SafeAreaProvider>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        useLegacyImplementation={true}
        initialRouteName={"Volunteering"}
        screenOptions={{
          headerShown: true,
          swipeEnabled: false,
          headerStyle: {
            backgroundColor: "#FFA046",
          },
          drawerActiveBackgroundColor: "#FFE5CD",
          drawerActiveTintColor: "#000",
          drawerInactiveTintColor: "#000",
          drawerLabelStyle: {
            marginLeft: -15,
            fontSize: 15,
          },
        }}
      >
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Профіль",
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={23} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Volunteering"
          component={Volunteering}
          options={{
            title: "Волонтерство",
            drawerIcon: ({ color }) => (
              <Icon
              name='hand-heart-outline'
              type='material-community'
              color={color}
              size={23}
            />
            ),
          }}
        />
        <Drawer.Screen
          name="Filter"
          component={LocationStack}
          options={{
            title: "Фільтр",
            drawerIcon: ({ color }) => (
              <Icon
              name='filter'
              type='octicon'
              color={color}
              size={23}
            />
            ),
          }}
        />
        <Drawer.Screen
          name="Favorites"
          component={FavoritesList}
          options={{
            title: "Вибране",
            drawerIcon: ({ color }) => (
              <Ionicons name="bookmark-outline" size={23} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaProvider>
  );
};
