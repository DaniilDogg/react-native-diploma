import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableHighlight, View, Alert, DeviceEventEmitter } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import { Avatar, Icon, Text } from "@rneui/base";
import { auth, firestore } from "../../../firebase/firebase-config";

import Ionicons from "react-native-vector-icons/Ionicons";
import { signOut } from "firebase/auth";

export const CustomDrawer = (props) => {
  const blankAvatar = "./../../../assets/images/blank-profile-picture.jpg";

  const [imageURI, setImageURI] = useState(null);
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    setImageURI(auth.currentUser.photoURL);
    setDisplayName(auth.currentUser.displayName);

    const subscription = DeviceEventEmitter.addListener("event.edited", async (eventData) => {
      setTimeout(()=>{
        setImageURI(auth.currentUser.photoURL);
        setDisplayName(auth.currentUser.displayName);
      }, 500)
    })

    return () => {
      subscription.remove()
      DeviceEventEmitter.removeAllListeners('event.edited');
    }
  }, []);

  const showConfirmDialog = () => {
    return Alert.alert(
      "Sign out?",
      "Are you sure you want to sign out of your account?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: singOutUser,
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  const singOutUser = async () => {
    try {
      await signOut(auth);
      props.navigation.replace("Sign In");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={[styles.backgroundColor, { flex: 1 }]}>
      <View style={[styles.backgroundColor, styles.top]}>
        <Avatar
          activeOpalocation={0.2}
          avatarStyle={{ borderRadius: 200 }}
          containerStyle={[styles.avatar]}
          icon={{}}
          iconStyle={{}}
          imageProps={{}}
          //onPress={}
          overlayontainerStyle={{}}
          placeholderStyle={{}}
          rounded
          //size="xlarge"
          source={imageURI == null ? require(blankAvatar) : { uri: imageURI }}
        />
        <Text style={[styles.displayName, {}]}>{displayName}</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: "#EBE0D4" }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
      <View style={{ backgroundColor: "#EBE0D4" }}>
        <TouchableHighlight
          style={{ marginBottom: 30, marginLeft: 10, marginRight: 10 }}
          activeOpacity={1}
          underlayColor="#FFE5CD"
          onPress={showConfirmDialog}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 7,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="log-out-outline" size={26} color={"#000"} />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 15 }}>
              Sign out
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  ); //{displayName} Абдурахмангаджи Христорождественская Абдурахмангаджарович {displayName} Юрченко Даниил Сергеевич
};
const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "#FFA046",
  },
  top: {
    flexDirection: "row",
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomColor: "#C08F61",
    borderBottomWidth: 1,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 200,
    backgroundColor: "#BDBDBD",
    alignSelf: "flex-start",
    marginLeft: 15,
  },
  displayName: {
    flex: 1,
    alignSelf: "flex-end",
    flexWrap: "wrap",
    fontWeight: "700",
    fontSize: 17,
    marginLeft: 10,
  },
});
