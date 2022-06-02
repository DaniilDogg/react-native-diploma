import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Avatar, Text, Icon } from "@rneui/base";
// Styles
import { authStyle } from "./style";
//
//Firebase
import { auth, storage, firestore } from "../../firebase/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import {
  ref as reference,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
//
import * as ImagePicker from "expo-image-picker";

export const CreateAccountScreen = ({ navigation }) => {
  const blankAvatar = "./../../assets/images/blank-profile-picture.jpg";
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState(auth?.currentUser?.displayName);
  const [nameStyle, setNameStyle] = useState({});
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const [location, setLocation] = useState("");
  const [imageURI, setImageURI] = useState(auth?.currentUser?.photoURL);

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Необхідно надати доступ до зображень.");
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

  const createAccount = async () => {
    if (name == "") {
      setNameErrorMessage("Введіть ваше ім'я.");
      setNameStyle(authStyle.errorContainer);
      return;
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
        alert("Не вдалося завантажити фото.");
      }
    }
    updateProfile(user, {
      displayName: name,
      photoURL: photoUrl,
    });
    await setDoc(doc(firestore, "users", `${user.uid}`), {
      email: user.email,
      displayName: name,
      photoURL: photoUrl,
      location: location,
    });
    setIsLoading(false);
    navigation.replace("DrawerScreen");
  };

  return (
    <SafeAreaView style={{ height:'100%', backgroundColor: "#fff" }}>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={authStyle.main_container}>
          <View style={authStyle.view}>
            <Text h3 style={authStyle.pageTitle}>
              Create account
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
              containerStyle={[authStyle.input, nameStyle]}
              labelStyle={[authStyle.lable]}
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
              errorStyle={authStyle.errorText}
              errorMessage={nameErrorMessage}
            />
            <Input
              containerStyle={([authStyle.input], { display: "none" })}
              labelStyle={[authStyle.lable]}
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
                title="Create account"
                buttonStyle={[authStyle.button]}
                titleStyle={[authStyle.buttonTitle]}
                onPress={createAccount}
                loading
                loadingStyle={[authStyle.button]}
                loadingProps={{ animating: true }}
                disabled
                disabledStyle={[authStyle.button]}
              />
            ) : (
              <Button
                title="Create account"
                buttonStyle={[authStyle.button]}
                titleStyle={[authStyle.buttonTitle]}
                onPress={createAccount}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
});
