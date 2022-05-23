import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Avatar, Text, Icon } from "@rneui/base";
//Firebase
import { auth, storage, firestore } from "../../../firebase/firebase-config";
//
import Ionicons from "react-native-vector-icons/Ionicons";

export const Profile = (props) => {
  //props.navigation.closeDrawer();
  const blankAvatar = "./../../../assets/images/blank-profile-picture.jpg";

  const [displayName, setDisplayName] = useState(
    auth?.currentUser?.displayName
  );
  const [imageURI, setImageURI] = useState(auth?.currentUser?.photoURL);
  const [location, setLocation] = useState("");

  const subscription = DeviceEventEmitter.addListener("event.edited", (eventData) => {
    setImageURI(auth?.currentUser?.photoURL);
    setDisplayName(auth?.currentUser?.displayName);
  })

  return (
    <View style={{ height: "100%" }}>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={{}}>
          <Avatar
            avatarStyle={{
              height: 320,
              width: 320,
              borderRadius: 600,
            }}
            containerStyle={[styles.avatar]}
            icon={{}}
            iconStyle={{}}
            imageProps={{}}
            overlayContainerStyle={{}}
            placeholderStyle={{}}
            rounded
            size="xlarge"
            source={imageURI == null ? require(blankAvatar) : { uri: imageURI }}
          />
          <Button
            icon={
              <Ionicons
                name="create-outline"
                size={45}
                style={{ margin: 0, padding: 0, fontWeight: "bold" }}
              />
            }
            containerStyle={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
            buttonStyle={[
              {
                paddingHorizontal: 0,
                paddingVertical: 0,
                margin: 0,
                width: 45,
                height: 45,
                backgroundColor: "",
              },
            ]}
            onPress={() => {
              props.navigation.navigate("EditProfile")
            }}
          />
        </View>
        <View style={[styles.info]}>
          <View style={[styles.infoItem]}>
            <Text style={[styles.name]}>{displayName}</Text>
            <Text style={[styles.lable]}>Name</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 320,
    width: 320,
    borderRadius: 600,
    backgroundColor: "#BDBDBD",
    alignSelf: "center",
    marginVertical: 20,
  },
  info: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: -5,
  },
  infoItem: {
    padding: 10,
    backgroundColor: "#FFE5CD",
    borderRadius: 15,
  },
  lable: {
    color: "#000",
    fontWeight: "normal",
    fontSize: 14,
  },
  name: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
});
