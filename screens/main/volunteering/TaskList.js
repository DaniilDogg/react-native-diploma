import React, { useState, useEffect, useLayoutEffect } from "react";

import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  DeviceEventEmitter,
} from "react-native";
import { Avatar, Icon, Text } from "@rneui/base";
import { LinearGradient } from 'expo-linear-gradient';

import { Task } from "../task/Task";

import { auth, firestore } from "../../../firebase/firebase-config";
import {
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  getDocs,
  query,
  where,
  doc,
  get,
  getDoc,
  Timestamp,
  collectionGroup,
  documentId,
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
    console.log(location)
    if(location == 'Уся Україна'){
      q = query(collectionRef)
    }
    else if (location.includes(', ')){
      q = query(collectionRef, where("location", "==", location));      
    }
    else{
      q = query(collectionRef, where("region", "==", location.slice(4, location.length)))
    }
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const tasks = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const task = {
            createdAt: document.data().createdAt,
            task_id: document.id,
            title: document.data().title,
            description: document.data().description,
            followers: document.data().followers,
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
      style={[styles.task_container]}
      activeOpacity={1}
      underlayColor={"#fff"}
      onPress={() => {
        notPressed = false;
        setTimeout(() => {
          notPressed = true;
        }, 500);

        /////////////////////////////////////
        props.navigation.navigate("TaskStack", {
          key: props.route.params.key,
          title: props.route.params.title,
          task_id: item.task_id,
          userId: userId,
        });
        /////////////////////////////////////
      }}
    >
      <LinearGradient colors={styles.gradient_colors} style={[styles.gradient]}>
        <View style={[styles.inner_container]}>
          <View style={{ width: "100%", flexDirection: "row", height: 55 }}>
            <Text numberOfLines={2} style={[styles.title]}>
              {item.title}
            </Text>
            <View>
              <Text style={[styles.time]}>
                {formatDate(item.createdAt.toDate(), "dd:MM:yy")}
              </Text>
              <Text style={[styles.time, {}]}>
                {"Відст:\n" + item.followers.length}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#000",
              height: 1,
              width: "100%",
              marginVertical: 10,
            }}
          />

          <Text
            ellipsizeMode="tail"
            numberOfLines={2}
            style={[styles.description]}
          >
            {item.description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableHighlight>
  );

  if (tasks == null) return null;
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {tasks.length > 0 ? (
        <FlatList style={{ width: "100%", paddingTop: 15, }} data={tasks} renderItem={Item} />
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

const styles = StyleSheet.create({
  task_container: {
    height: 160,
    marginHorizontal: 12,
    marginBottom: 20,    
  },
  gradient:{
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    elevation: 5,
    
  },
  gradient_colors: ['#ffe4c4', '#fffdd0', '#ffe4c4'],
  underlayColor: "#EBE0D4",
  inner_container: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 15,
    height: "100%",
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "bold",    
    alignSelf: 'center',
  },
  time: {
    fontSize: 15,
    color: "#696969",
    fontWeight: "bold",
    textAlign: 'right',
  },
  description: {
    fontSize: 18,
    fontWeight: "normal",
    width: "100%",
    lineHeight: 26,
  },
});
