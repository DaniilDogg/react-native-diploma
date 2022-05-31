import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, TouchableHighlight, FlatList } from "react-native";
import { Avatar, Icon, Text } from "@rneui/base";
import { Task } from "./Task";
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
} from "firebase/firestore";

export const TaskList = (props) => {
  const [tasks, setTasks] = useState(null);


  useLayoutEffect(() => {
    const collectionRef = collection(firestore, `/VolunteeringTasks/${props.route.params.volunteering_type}/tasks`);
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const tasks = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const task = {
            task_id: document.id,
            title: document.data().title,
            description: document.data().description,
          };
          return task;
        })
      );
      setTasks(tasks);
    });

    return unsubscribe;
  }, []);

  let notPressed = true
  
  const Item = ({ item }) => (
    <TouchableHighlight
      style={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor:'#BDBDBD'
      }}
      activeOpacity={1}
      underlayColor="#EBE0D4"
      onPress={() => {
        notPressed = false
        setTimeout(()=> {
          notPressed = true;
        }, 500)
        props.navigation.navigate('TaskStack', { volunteering_type: props.route.params.volunteering_type, title: item.title, task_id: item.task_id })
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          paddingHorizontal: 7,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "normal", marginLeft: 15 }}>
          {item.description}
        </Text>
      </View>
    </TouchableHighlight>
  );

  return(
      <View style={{flex: 1, backgroundColor: '#fff'}}>
          <FlatList
          style={{width: '100%'}}
          data={tasks}
          renderItem={Item}
          />
      </View>
  )
  ;
};
