import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
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
} from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";

export const Task = (props) => {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

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
          {"\n"}
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
    alignSelf: "center",
    lineHeight: 33
  },
  divider_container:{
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
    alignSelf: "center",
    lineHeight: 28
  },
  button: {
    backgroundColor: "#FFA046",
  },
  buttonTitle: {
    fontSize: 19,
    paddingVertical: 3,
  },
});
