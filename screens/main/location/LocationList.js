import React, { useState, useEffect } from "react";
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

export const LocationList = (props) => {
  const [userId, setUserId] = useState(auth?.currentUser?.uid);
  const locations = require("./location.json");
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
          const docRef = doc(firestore, "users", userId);
          await updateDoc(docRef, {
            location: newLocation,
          });
          DeviceEventEmitter.emit("event.location", "location");
          props.navigation.replace("LocationFilterScreen");
        };

        if (item == "Уся Україна") {
          update(item);
          return;
        }
        if (props?.route?.params?.region == "") {
          props.navigation.navigate("LocationList", { region: item });
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
        {item != "Уся Україна" && (
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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList style={{ width: "100%" }} data={data} renderItem={Item} />
    </View>
  );
};
