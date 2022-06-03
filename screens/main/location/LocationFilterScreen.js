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

export const LocationFilterScreen = (props) => {
  const [userId, setUserId] = useState(auth?.currentUser?.uid);
  const [location, setLocation] = useState(null);
  const [notLoaded, setNotLoaded] = useState(true);

  useLayoutEffect(() => {
      (async ()=>{
        const docRef = doc(firestore, "users", userId);
        const userData = await getDoc(docRef);
        setLocation(userData.data().location.replace(", ", ",\n"));
        setNotLoaded(false);
      })()
  }, [props.route.params.location]);

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
        <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
        <Ionicons style={{marginHorizontal: 15}} name="location-outline" size={33} color={"#000"} />          
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              paddingVertical: 15,              
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "normal",
                marginEnd: 50,  
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
