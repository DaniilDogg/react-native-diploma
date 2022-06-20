import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, ToastAndroid } from "react-native";
import { Button, Icon, Text, Divider } from "@rneui/base";

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
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";

export const Task = (props) => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  const [isFollowed, setIsFollowed] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(props?.route?.params?.purpose)

  const taskRef = `VolunteeringTasks/${props.route.params.key}/tasks/${props.route.params.task_id}`

  const checkTask = async () => {
    const docRef = doc(firestore, "users", props.route.params.userId);
    const userData = await getDoc(docRef);
    const followedTasks = userData.data().followedTasks;
    setIsFollowed(followedTasks.includes(taskRef));
  };

  useEffect(() => {
    const docRef = doc(firestore, "users", props.route.params.userId);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      let tasksArray = doc.data().followedTasks;
      let createdTasks = doc.data().createdTasks;
      //console.log(tasksArray.includes(taskRef));
      setIsAdmin(createdTasks.includes(taskRef))
      setIsFollowed(tasksArray.includes(taskRef));
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const UserButton = () => {
    return (
      <Button
        loading={isLoading}
        icon={
          <Icon
            name={
              isFollowed ? "remove-circle-outline" : "add-circle-outline"
            }
            type="ionicon"
            color="#000"
            size={35}
          />
        }
        onPress={async () => {
          if (isLoading) return;
          setIsLoading(true);
          const docRef = doc(firestore, "users", props.route.params.userId);
          const taskDocRef = doc(firestore, taskRef)
          if (isFollowed) {                
            await updateDoc(docRef, {
              followedTasks: arrayRemove(taskRef),
            });
            await updateDoc(taskDocRef, {
              followers: arrayRemove(props.route.params.userId),
            });
            
            ToastAndroid.showWithGravity(
              "Вилучено з вибраного",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          } else {
            await updateDoc(docRef, {
              followedTasks: arrayUnion(taskRef),
            });
            await updateDoc(taskDocRef, {
              followers: arrayUnion(props.route.params.userId),
            });
            ToastAndroid.showWithGravity(
              "Додано у вибране",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
        }}
        buttonStyle={{
          backgroundColor: "#FFA046",
          paddingLeft: 12,
          paddingRight: 12,
          height: "100%",
          borderRadius: 0,
        }}
      />
    );
  }

  const AdminButton = () => {
    return (
      <Button
        icon={
          <Icon
            name={
              'menu'
            }
            type="entypo"
            color="#000"
            size={30}
          />
        }
        onPress={async () => {

        }}
        buttonStyle={{
          backgroundColor: "#FFA046",
          paddingLeft: 12,
          paddingRight: 12,
          height: "100%",
          borderRadius: 0,
        }}
      />
    );
  }

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        if (isFollowed == null) return;
        if(isAdmin){
          return(
            <AdminButton/>
          )
        }
        else{
          return(
            <UserButton/>
          )
        }
      },
    });
  }, [props.navigation, isFollowed, isLoading]);

  useEffect(() => {
    (async () => {
      const docRef = doc(
        firestore,
        `/VolunteeringTasks/${props.route.params.key}/tasks/${props.route.params.task_id}`
      );
      const docSnap = await getDoc(docRef);
      setTitle(docSnap.data().title);
      setDescription(docSnap.data().description);
      setCreatedAt(docSnap.data().createdAt);
    })();
  }, []);

  return (
    <View style={[style.main_container]}>
      <ScrollView>
        <Text style={[style.title]}>{title}</Text>
        <View style={[style.divider_container]}>
          <Divider
            style={[style.divider]}
            color="#000"
            orientation="horizontal"
          />
        </View>
        <Text style={[style.description, {}]}>
          {description}
        </Text>
      </ScrollView>
      <Button
        buttonStyle={[style.button]}
        title={"Chat"}
        titleStyle={[style.buttonTitle]}
        onPress={() => {
          props.navigation.navigate("Chat", {
            key: props.route.params.key,
            task_id: props.route.params.task_id,
          });
        }}
      />
    </View>
  );
};

const style = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 25,
    color: "#000",
    marginHorizontal: 15,
    marginTop: 15,
    alignSelf: "flex-start",
    lineHeight: 33,
  },
  divider_container: {
    marginHorizontal: 10,
  },
  divider: {
    width: "100%",
    alignSelf: "center",
    marginTop: 15,
  },
  description: {
    fontSize: 20,
    color: "#000",
    marginHorizontal: 12,
    marginVertical: 15,
    alignSelf: "flex-start",
    lineHeight: 28,
  },
  button: {
    backgroundColor: "#FFA046",
  },
  buttonTitle: {
    fontSize: 19,
    paddingVertical: 3,
  },
});
