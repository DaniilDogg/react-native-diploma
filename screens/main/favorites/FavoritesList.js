import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  DeviceEventEmitter,
} from "react-native";
import { Avatar, Icon, Text } from "@rneui/base";
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
import { async } from "@firebase/util";

export const FavoritesList = (props) => {
  const [userId, setUserId] = useState(auth?.currentUser?.uid);
  if (userId == null) return null;

  const [tasksId, setTasksId] = useState(null);
  const [tasks, setTasks] = useState(null);
  let notLoaded = true;

  useEffect(() => {
    const docRef = doc(firestore, "users", userId);
    const unsubscribe = onSnapshot(docRef, async (doc) => {
      setTasksId(doc.data().followedTasks);
    });

    return unsubscribe;
  }, []);

  //  if (tasksId == null) return null;
  useLayoutEffect(() => {
    (async () => {
      if (tasksId === null) return;
      
      if (tasksId.length <= 0){
        setTasks([])
        return
      }
      const q = query(
        collectionGroup(firestore, "tasks"),
        where(documentId(), "in", tasksId)
      );
      const querySnapshot = await getDocs(q);
      const followedTasks = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const task = {
            key: document.ref.path.split('/')[1],
            createdAt: document.data().createdAt,
            task_id: document.id,
            title: document.data().title,
            description: document.data().description,
          };
          return task;
        })
      );
      followedTasks.sort((a, b) => {
        if (a.createdAt.toDate() < b.createdAt.toDate()) {
          return -1;
        }
        if (a.createdAt.toDate() > b.createdAt.toDate()) {
          return 1;
        }
        return 0;
      });
      setTasks(followedTasks);
      notLoaded = false;
    })();
  }, [tasksId]);

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
          key: item.key,
          title: 'Вибране',
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
        <View style={{ flex: 1, width: "100%" }}>
          <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: "bold" }}>
            {item.title}
          </Text>
          <Text
            style={{ position: "absolute", top: 0, right: 0, color: "#707070" }}
          >
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
