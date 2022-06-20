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
import { doc, updateDoc } from "firebase/firestore";
//
import Ionicons from "react-native-vector-icons/Ionicons";

export const TaskLocationList = (props) => {

  useLayoutEffect(() => {
    props.navigation.setOptions({  
      headerShown: true,
      title: 'Створення завдання',
      headerStyle: {
        backgroundColor: "#FFA046",
      },
    });
  }, []);

  const [userId, setUserId] = useState(auth?.currentUser?.uid);

  const locations = require("../location/location.json");

  const regions =
    props.route.params.region == "" ? "regions" : props.route.params.region;
  const data = locations[regions];

  const Item = ({ item }) => (
    <TouchableHighlight
      style={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#BDBDBD",
      }}
      activeOpacity={1}
      underlayColor="#EBE0D4"
      onPress={async () => {
        const update = async (newLocation) => {
          if(newLocation.includes(', Уся ')){
            newLocation = newLocation.split(', ')[1]
          }
          props.navigation.replace("CreateTask", {location: newLocation, title: props?.route?.params?.title, description: props?.route?.params?.description, category: props?.route?.params?.category});
        };

        if (item == "Уся Україна") {
          update(item);
          return;
        }
        if (props?.route?.params?.region == "") {
          props.navigation.replace("TaskLocationList", { region: item, title: props?.route?.params?.title, description: props?.route?.params?.description, category: props?.route?.params?.category });
        }
        else {
          let location = props.route.params.region;
          location += `, ${item}`;
          update(location);
        }
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
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
          {item}
        </Text>
        {(item != "Уся Україна" && props?.route?.params?.region == "") && (
          <Ionicons
            style={{ position: "absolute", right: 20, top: "40%" }}
            name="chevron-forward-outline"
            size={26}
            color={"#000"}
          />
        )}
      </View>
    </TouchableHighlight>
  );

  if (userId == null) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList style={{ width: "100%" }} data={data} renderItem={Item} />
    </View>
  );
};
