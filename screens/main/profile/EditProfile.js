import React, { useState } from "react";
import { StyleSheet, View, ScrollView, DeviceEventEmitter } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Avatar, Text, Icon } from "@rneui/base";
//
//Firebase
import { auth, storage, firestore } from "../../../firebase/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import {
  ref as reference,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
//
import * as ImagePicker from "expo-image-picker";

export const EditProfile = (props) => {
  const blankAvatar = "./../../../assets/images/blank-profile-picture.jpg";
  const [isLoading, setIsLoading] = useState(false);

  const [oldName, setOldName] = useState(auth?.currentUser?.displayName);
  const [name, setName] = useState(oldName);
  const [nameStyle, setNameStyle] = useState({});
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const [location, setLocation] = useState("");

  const [oldImageURI, setOldImageURI] = useState(auth?.currentUser?.photoURL);
  const [imageURI, setImageURI] = useState(oldImageURI);

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    //console.log(result);
    if (!result.cancelled) {
      setImageURI(result.uri);
    }
  };

  const editProfile = async () => {
    if (name == "") {
      setNameErrorMessage("Enter your name.");
      setNameStyle(styles.errorContainer);
      return;
    }
    if(oldImageURI == imageURI && oldName == name){
      props.navigation.replace("Profile")
    }
    setIsLoading(true);
    const user = auth.currentUser;
    let photoUrl = user.photoURL;
    if (imageURI != "") {
      const imageRef = reference(storage, `avatars/${user.uid}/avatar.jpg`); //how the image will be addressed inside the storage
      try {
        const img = await fetch(imageURI);
        //convert image to array of bytes
        const bytes = await img.blob();
        const snapshot = await uploadBytes(imageRef, bytes); //upload images
        photoUrl = await getDownloadURL(imageRef);
      } catch (error) {
        console.log(error);
        alert("Can't upload avatar.");
      }
    }
    updateProfile(user, {
      displayName: name,
      photoURL: photoUrl,
    })
    await setDoc(doc(firestore, "users", `${user.uid}`), {
      email: user.email,
      displayName: name,
      photoURL: photoUrl,
      location: location,
    });
    setIsLoading(false);
    DeviceEventEmitter.emit("event.edited", "edited");
    props.navigation.replace("Profile")
  };

  return (
    <View style={{ height: "100%" }}>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={styles.main_container}>
          <View style={styles.view}>
            <Text h3 style={styles.pageTitle}>
                Edit Profile
            </Text>

            <Avatar
              activeOpalocation={0.2}
              avatarStyle={{}}
              containerStyle={[styles.avatar]}
              icon={{}}
              iconStyle={{}}
              imageProps={{}}
              onPress={pickImage}
              overlayContainerStyle={{}}
              placeholderStyle={{}}
              rounded
              size="xlarge"
              source={
                imageURI == null ? require(blankAvatar) : { uri: imageURI }
              }
            >
              <View style={[styles.icon]}>
                <Icon
                  color="#8BCD50"
                  size={40}
                  name="autorenew"
                  type="material-community"
                />
              </View>
            </Avatar>

            <Input
              containerStyle={[styles.input, nameStyle]}
              labelStyle={[styles.lable]}
              placeholder="Your name"
              label="Name*"
              leftIcon={{ type: "ionicon", name: "person-outline" }}
              value={name}
              onChangeText={(text) => {
                setName(text);
              }}
              onEndEditing={() => {
                setNameErrorMessage("");
                setNameStyle({});
              }}
              renderErrorMessage
              errorStyle={styles.errorText}
              errorMessage={nameErrorMessage}
            />
            <Input
              containerStyle={([styles.input], { display: "none" })}
              labelStyle={[styles.lable]}
              placeholder="Your location"
              label="Location"
              leftIcon={{
                type: "material-community",
                name: "home-city-outline",
              }}
              value={location}
              onChangeText={(text) => setLocation(text)}
            />
            {isLoading ? (
              <Button
                title="Edit"
                buttonStyle={[styles.button]}
                titleStyle={[styles.buttonTitle]}
                onPress={editProfile}
                loading
                loadingStyle={[styles.button]}
                loadingProps={{ animating: true }}
                disabled
                disabledStyle={[styles.button]}
              />
            ) : (
              <Button
                title="Edit"
                buttonStyle={[styles.button]}
                titleStyle={[styles.buttonTitle]}
                onPress={editProfile}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#BDBDBD",
    alignSelf: "center",
    marginVertical: 20,
  },
  icon: {
    position: "absolute",
    backgroundColor: "#e9e9e9",
    borderRadius: 200,
    bottom: 8,
    right: 8,
  },
  main_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  view: {
    flex: 0,
    width: "100%",
  },
  pageTitle: {
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  lable: {
    color: "#000",
    fontWeight: "normal",
  },
  buttonTitle: {
    marginVertical: 2,
    fontSize: 25,
    color: '#000',
  },
  input: {
    marginVertical: 3,
    borderWidth: 2,
    borderColor: "#fff",
  },
  button: {
    alignSelf: "center",
    width: "70%",
    backgroundColor: "#FFA046",
    borderColor: "#FFA046",
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 7,
    height: 60,
  },
  secondButton: {
    backgroundColor: "#fff",
  },
  errorContainer: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    fontSize: 16,
  },
  singInErrorContainer: {
    fontSize: 16,
    color: "red",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
    height: 45,
    textAlign: "center",
  },
});
