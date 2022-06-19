import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  DeviceEventEmitter,
  TextInput,
} from "react-native";
import { Avatar, Icon, Text, Input, Button } from "@rneui/base";
import { Task } from "../task/Task";
import Ionicons from "react-native-vector-icons/Ionicons";
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

import { Location } from "../location/LocationFilterScreen";

export const CreateTask = (props) => {

  const [location, setLocation] = useState()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(()=>{
    setLocation(props.route.params.location)
  }, [props.route.params.location])

  useLayoutEffect(() => {
    props.navigation.setOptions({  
      headerShown: true,
      title: 'Створення завдання',
      headerStyle: {
        backgroundColor: "#FFA046",
      },
    });
  }, [props.navigation]);

  const createNewTask = ()=>{
    const { _id, createdAt, text, user } = messages[0];
    addDoc(
      collection(
        firestore,
        `/chats/${props.route.params.key}/${props.route.params.task_id}`
      ),
      {
        _id,
        createdAt,
        text,
        user,
      }
    );
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>
      <Text style={[style.title]}>Заголовок:</Text>
      <Input
        containerStyle={[]}
        placeholder="Заголовок"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
        }}
        onEndEditing={() => {
            setTitle((prev) => prev == '' ? prev.trim() : null);
        }}
      />
      <Text style={[style.title]}>Опис:</Text>
      <TextInput
        style={[style.input]}
        placeholder="Опис"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
        }}
        onEndEditing={() => {
            setDescription((prev) => prev == '' ? prev.trim() : null);
        }}
        multiline={true}
      />
      <TouchableHighlight
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#BDBDBD",
          marginTop: 20
        }}
        activeOpacity={1}
        underlayColor="#EBE0D4"
        onPress={() => {
          props.navigation.navigate("TaskLocationList", {
            region: "",
          });
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", paddingRight: 10 }}>
        <Ionicons style={{marginHorizontal: 15}} name="location-outline" size={33} color={"#000"} />          
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              paddingVertical: 15,              
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "normal",
                marginEnd: 50,  
              }}
            >
              {location == '' ? 'Місцезнаходження' : location}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
      <Button
        title="Створити"
        buttonStyle={[style.button]}
        titleStyle={[style.buttonTitle]}
        onPress={()=>createNewTask()}
      />
    </View>
  );
};

const style = StyleSheet.create({
  title: {
    fontSize: 22,
  },
  input: {
    marginTop: 8,
    fontSize: 18,
    borderColor: "black",
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  buttonTitle: {
    marginVertical: 2,
    fontSize: 22,
  },
  button: {
    alignSelf: 'center',
    width: '70%',
    backgroundColor: '#FFA046',
    borderColor: '#FFA046',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
    height: 60,
  },
});
