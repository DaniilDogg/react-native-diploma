import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  FlatList,
  DeviceEventEmitter,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Avatar, Icon, Text, Input, Button } from "@rneui/base";
import { SelectCountry } from 'react-native-element-dropdown';
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
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";

import { Location } from "../location/LocationFilterScreen";

export const CreateTask = (props) => {
  const [notLoaded, setNotLoaded] = useState(true)

  const [categoryList, setCategoryList] = useState()
  const [category, setCategory] = useState(null)

  useEffect(() => {
    (async () => {
      const collectionRef = collection(firestore, "Volunteering");
      const q = query(collectionRef, orderBy("title"));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        value: doc.data().key,
        lable: doc.data().title,
        image: {
          uri: doc.data().iconURL,
        },
      }));
      setCategoryList(data);
      setCategory((prev)=>(prev == null ? data[0].value : prev))
      setNotLoaded(false)
    })();
  }, []);

  const [location, setLocation] = useState()
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(()=>{
    setLocation(props.route.params.location)
    setTitle(props?.route?.params?.title)
    setDescription(props?.route?.params?.description)
    setCategory(props?.route?.params?.category)
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

  const createNewTask = async ()=>{
    if(!(category != null && title != '' && description != '' && location != '')) {
      ToastAndroid.showWithGravity(
        "Заповніть всі поля.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return
    }
    let region = ''
    if(location.includes(', ')){
      region = location.split(', ')[0]
    }
    else{
      region = location.slice(4, location.length)
    }
    const taskRef = await addDoc(
      collection(
        firestore,
        `/VolunteeringTasks/${category}/tasks`
      ),
      {
        title: title,
        description: description,
        createdAt: Timestamp.now(),
        creator: auth.currentUser.uid,
        followers: [],
        location: location,
        region: region
      }
    );
    const docRef = doc(firestore, "users", auth.currentUser.uid);
    await updateDoc(docRef, {
      createdTasks: arrayUnion(taskRef.path),
    });
    ToastAndroid.showWithGravity(
      "Завдання створенно.",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
    props.navigation.navigate("CreatedList");
  }

  if(notLoaded) return null
  
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 10 }}>

      <Text style={[style.title]}>Категорія:</Text>
        <SelectCountry
        style={styles.dropdown}
        containerStyle={{
          elevation: 10,
          shadowColor: 'red',
          marginTop: -104,
          marginLeft: -7,
        }}
        selectedTextStyle={styles.selectedTextStyle}
        placeholderStyle={styles.placeholderStyle}
        imageStyle={styles.imageStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        //search
        maxHeight={300}
        value={category}
        data={categoryList}
        valueField="value"
        labelField="lable"
        imageField="image"
        placeholder="Оберіть категорію"
        searchPlaceholder="Пошук..."
        onChange={e => {
          setCategory(e.value);
        }}
      />


      <Text style={[style.title]}>Заголовок:</Text>
      <Input
        containerStyle={[]}
        placeholder="Заголовок"
        value={title}
        onChangeText={(text) => {
          setTitle(text);
        }}
        onEndEditing={() => {
            setTitle((prev) => (prev != null ? prev.trim() : null));
        }}
      />


      <Text style={[style.title]}>Опис:</Text>
      <TextInput
        textAlignVertical='top'
        style={[style.input]}
        placeholder="Опис"
        value={description}
        onChangeText={(text) => {
          setDescription(text);
        }}
        onEndEditing={() => {
            setDescription((prev) => (prev != null ? prev.trim() : null));
        }}
        multiline={true}
      />


      <TouchableHighlight
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#BDBDBD",
          marginTop: 30
        }}
        activeOpacity={1}
        underlayColor="#EBE0D4"
        onPress={() => {
          props.navigation.replace("TaskLocationList", {
            region: "",
            title: title,
            description: description,
            category: category,
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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    paddingHorizontal: 11,
    paddingVertical: 12,
    minHeight: 100,
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


const styles = StyleSheet.create({
  dropdown: {
    margin: 10,
    marginBottom: 20,
    height: 'auto',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  imageStyle: {
    width: 24,
    height: 24,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 18,
    marginLeft: 8,
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});