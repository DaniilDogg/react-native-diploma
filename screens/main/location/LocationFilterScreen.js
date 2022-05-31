import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  DeviceEventEmitter,
  TouchableHighlight,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Avatar, Text, Icon } from "@rneui/base";
//Firebase
import { auth, storage, firestore } from "../../../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
//
import Ionicons from "react-native-vector-icons/Ionicons";
import { async } from "@firebase/util";

export const LocationFilterScreen = (props) => {
  const [userId, setUserId] = useState(auth?.currentUser?.uid);
  const [location, setLocation] = useState(null);
  const [notLoaded, setNotLoaded] = useState(true);

  const getLocation = async () => {
    const docRef = doc(firestore, "users", userId);
    const userData = await getDoc(docRef);
    setLocation(userData.data().location.replace(", ", ",\n"));
    setNotLoaded(false);
  };
  useLayoutEffect(async () => {
    getLocation();

    const subscription = DeviceEventEmitter.addListener(
      "event.location",
      async (eventData) => {
        setTimeout(() => {
          getLocation();
        }, 500);
      }
    );

    return () => {
      subscription.remove();
      DeviceEventEmitter.removeAllListeners("event.location");
    };
  }, []);

  if (userId == null || notLoaded) return null;

  return (
    <View style={{ height: "100%", backgroundColor: "#fff" }}>
      <Text
        style={{
          color: "#000",
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
          marginVertical: 10,
        }}
      >
        Місцезнаходження
      </Text>
      <TouchableHighlight
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#BDBDBD",
        }}
        activeOpacity={1}
        underlayColor="#EBE0D4"
        onPress={() => {
          props.navigation.navigate("LocationList", {
            region: "",
          });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons style={{marginLeft: 20}} name="location-outline" size={30} color={"#000"} />
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              paddingHorizontal: 7,
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "normal",
                marginLeft: 15,
                marginVertical: 5,
              }}
            >
              {location}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};
