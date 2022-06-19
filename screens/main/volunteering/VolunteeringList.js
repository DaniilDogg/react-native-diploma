import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableHighlight, FlatList } from "react-native";

import { Icon, Text, Image, Button } from "@rneui/base";
import { SvgUri } from "react-native-svg";

import { auth, firestore } from "../../../firebase/firebase-config";
import {
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  query,
  doc,
  get,
  getDoc,
  getDocs,
} from "firebase/firestore";

export const VolunteeringList = (props) => {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    (async () => {
      const collectionRef = collection(firestore, "Volunteering");
      const q = query(collectionRef, orderBy("title"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        img: doc.data().iconURL,
        title: doc.data().title,
        key: doc.data().key,
      }));
      setTasks(data);
      console.log("LOADED");
    })();
  }, []);
  let notPressed = true;

  const Item = ({ item }) => {
    return (
      <TouchableHighlight
        style={[
          {
            backgroundColor: "#FFF",
            borderRadius: 20,
            marginBottom: 20,
            marginHorizontal: 15,
            borderColor: "#FFA046",
            borderWidth: 1,
          },
          {
            elevation: 12,
            shadowColor: '#52006A',
          },
        ]}
        activeOpacity={1}
        underlayColor={"#FFE5CD"}
        onPress={() => {
          if (notPressed) {
            notPressed = false;
            setTimeout(() => {
              notPressed = true;
            }, 500);
            props.navigation.navigate("TaskList", {
              key: item.key,
              title: item.title,
            });
          }
        }}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 7,
              paddingVertical: 10,
            },
          ]}
        >
          <Image
            source={{ uri: item.img }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 50,
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: "normal", marginLeft: 15 }}>
            {item.title}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList style={{ marginTop: 15, width: "100%" }} data={tasks} renderItem={Item} />
    </View>
  );
};
