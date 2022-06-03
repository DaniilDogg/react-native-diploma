import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  DeviceEventEmitter,
} from "react-native";
import { Avatar, Icon, Text } from "@rneui/base";
import { Task } from "./Task";
import { auth, firestore } from "../../../firebase/firebase-config";
import {
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  query,
  where,
  doc,
  get,
  getDoc,
  Timestamp,
} from "firebase/firestore";

export const TaskList = (props) => {
  const [userId, setUserId] = useState(auth?.currentUser?.uid);
  if (userId == null) return null;
  const [location, setLocation] = useState(null);
  const [tasks, setTasks] = useState(null);
  let notLoaded = true;

  const getLocation = async () => {
    const docRef = doc(firestore, "users", userId);
    const userData = await getDoc(docRef);
    setLocation(userData.data().location);
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "event.location",
      async (eventData) => {
        setLocation(eventData);
      }
    );
    return () => {
      subscription.remove();
      DeviceEventEmitter.removeAllListeners("event.location");
    };
  }, []);

  useLayoutEffect(() => {
    if (location == null) {
      getLocation();
      return;
    }
    const collectionRef = collection(
      firestore,
      `/VolunteeringTasks/${props.route.params.key}/tasks`
    );
    let q = null;
    if(location == 'Уся Україна'){
      q = query(collectionRef)
    }
    else if (location.includes(', ')){
      q = query(collectionRef, where("location", "==", location));      
    }
    else{
      q = query(collectionRef, where("region", "==", location))
    }
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const tasks = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const task = {
            createdAt: document.data().createdAt,
            task_id: document.id,
            title: document.data().title,
            description: document.data().description,
          };
          return task;
        })
      );
      tasks.sort((a, b) => {
        if (a.createdAt.toDate() < b.createdAt.toDate()) {
          return -1;
        }
        if (a.createdAt.toDate() > b.createdAt.toDate()) {
          return 1;
        }
        return 0;
      });
      setTasks(tasks);
      notLoaded = false;
    });

    return unsubscribe;
  }, [location]);

  let notPressed = true;

  const formatDate = (date, newFormat) => {
    const dateDay = date.getDate();
    const dateMonth = date.getMonth() + 1;
    const dateYear = date.getFullYear();

    newFormat = newFormat.replace("MM", dateMonth.toString().padStart(2, "0"));

    if (newFormat.indexOf("yyyy") > -1) {
      newFormat = newFormat.replace("yyyy", dateYear.toString());
    } else if (newFormat.indexOf("yy") > -1) {
      newFormat = newFormat.replace("yy", dateYear.toString().substr(2, 2));
    }
    newFormat = newFormat.replace("dd", dateDay.toString().padStart(2, "0"));
    return newFormat;
  };

  const Item = ({ item }) => (
    <TouchableHighlight
      style={{
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#BDBDBD",
      }}
      activeOpacity={1}
      underlayColor="#EBE0D4"
      onPress={() => {
        notPressed = false;
        setTimeout(() => {
          notPressed = true;
        }, 500);
        props.navigation.navigate("TaskStack", {
          key: props.route.params.key,
          title: props.route.params.title,
          task_id: item.task_id,
          userId: userId,
        });
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
          paddingRight: 15,
          paddingLeft: 15,
          paddingVertical: 15,
        }}
      >
        <View style={{ flex: 1, width: "100%"}}>
          <Text
            numberOfLines={1}
            style={{ fontSize: 17, fontWeight: "bold" }}
          >
            {item.title}
          </Text>
          <Text style={{ position: "absolute", top: 0, right: 0, color: '#707070' }}>
            {formatDate(item.createdAt.toDate(), "dd:MM:yy")}
          </Text>
        </View>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={{ fontSize: 16, fontWeight: "normal", width: "100%" }}
        >
          {item.description}
        </Text>
      </View>
    </TouchableHighlight>
  );
  if (tasks == null) return null;
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {tasks.length > 0 ? (
        <FlatList style={{ width: "100%" }} data={tasks} renderItem={Item} />
      ) : (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Text style={{ fontSize: 22 }}>Завдання відсутні</Text>
        </View>
      )}
    </View>
  );
};
