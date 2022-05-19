import React, { useState, useEffect } from "react";
import { StyleSheet, View} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Avatar, Icon, Text } from "@rneui/base";
import { auth, firestore } from "./../../../firebase/firebase-config";

export const CustomDrawer = (props) => {
  const blankAvatar = "./../../../assets/images/blank-profile-picture.jpg";
  const [imageURI, setImageURI] = useState();
  const [displayName, setDisplayName] = useState();
  useEffect(()=>{
    setImageURI(auth?.currentUser?.photoURL);
    setDisplayName(auth?.currentUser?.displayName);
  }, [auth?.currentUser?.photoURL, auth?.currentUser?.displayName])

  return (
    <SafeAreaView style={[styles.backgroundColor, {flex: 1 }]}>
        <View style={[styles.backgroundColor, styles.top]}>
          <Avatar
            activeOpalocation={0.2}
            avatarStyle={{borderRadius: 200}}
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
        <View style={{ flex: 1, backgroundColor: '#EBE0D4' }}>
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
          </DrawerContentScrollView>
        </View>
    </SafeAreaView>
  ); //{displayName} Абдурахмангаджи Христорождественская Абдурахмангаджарович {displayName} Юрченко Даниил Сергеевич
};
const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: '#FFA046',
  },
  top:{
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomColor: '#C08F61',
    borderBottomWidth: 1,
  },
  avatar: {
    height: 80,
    width: 80,
    borderRadius: 200,
    backgroundColor: "#BDBDBD",
    alignSelf: 'flex-start',
    marginLeft: 15,
  },
  displayName:{
    flex: 1,
    alignSelf: 'flex-end',    
    flexWrap: 'wrap',
    fontFamily: 'Verdana',
    fontWeight: '700',
    fontSize: 17,
    marginLeft: 10,
  }
});
