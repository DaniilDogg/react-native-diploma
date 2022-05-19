import React, {
    useState,
    useEffect,
  } from "react";
  import { StyleSheet, View } from "react-native";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { auth, firestore } from "../../firebase/firebase-config";

 import { EditProfileScreen } from "./EditProfileScreen";
  
  export const ProfileScreen = (props) => {
  
    return (
        <EditProfileScreen {...props}/>
    );
  };