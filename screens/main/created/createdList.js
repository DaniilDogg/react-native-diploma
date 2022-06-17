import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableHighlight, FlatList } from "react-native";

import { Icon, Image, Text, Button } from "@rneui/base";

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

export const CreatedList = (props) => {
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    (async()=>{
      const collectionRef = collection(firestore, "Volunteering");
      const q = query(collectionRef, orderBy("title"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc)=>(
        {
          img: doc.data().iconURL,
          title: doc.data().title,
          key: doc.data().key,
        }
      ))
      setTasks(data);
      console.log("LOADED")
    })()
  }, []);
  let notPressed = true

  const Item = ({ item }) => {
    return(
    <TouchableHighlight
      style={{
        backgroundColor: "#EBE0D4",
        borderRadius: 20,
        marginVertical: 10,
        marginHorizontal: 15,
        borderColor: '#FFA046',
        borderWidth: 1
      }}
      activeOpacity={1}
      underlayColor={'#D4A26C'}
      onPress={() => {
        if(notPressed){
          notPressed = false
          setTimeout(()=> {
            notPressed = true;
          }, 500)
          props.navigation.navigate("TaskList", { key: item.key, title: item.title });
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 7,
          paddingVertical: 10,
        }}
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
  )}
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList style={{ width: "100%" }} data={tasks} renderItem={Item} />
    </View>
  );
};