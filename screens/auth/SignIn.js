import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Text } from "@rneui/base";
import { authStyle } from "./style";

import { auth, firestore } from "../../firebase/firebase-config";
import {
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export const SignInScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [emailStyle, setEmailStyle] = useState({});
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordStyle, setPasswordStyle] = useState({});
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  let inputs = [true, true];

  const signInUser = () => {
    setErrorMessage("");
    let er = false;
    if (email == "") {
      setEmailErrorMessage("Введіть свою електронну адресу.");
      setEmailStyle(authStyle.errorContainer);
      er = true;
    }
    if (password == "") {
      setPasswordErrorMessage("Введіть пароль.");
      setPasswordStyle(authStyle.errorContainer);
      er = true;
    }
    if (er || isNotValid()) {
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email.toLowerCase(), password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user.displayName === null) {
          navigation.navigate("CreateAccount");
        } else {
          const docRef = doc(firestore, "users", user.uid);
          const data = await getDoc(docRef);
          navigation.replace("DrawerScreen", {isAdmin: data.data().admin});
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(
          "Ця комбінація електронної пошти та пароля неправильна."
          );
      })
      .finally(() => setIsLoading(false));
  };

  const isNotValid = () => {
    if (email != "") {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        inputs[0] = false;
        setEmailErrorMessage("Неправильна електронна адреса.");
        setEmailStyle(authStyle.errorContainer);
        return true;
      }
    }
    setEmailErrorMessage("");
    setEmailStyle({});
    return false;
  };

  const checkPassword = () => {
    if (password != "") {
      setPasswordErrorMessage("");
      setPasswordStyle({});
    }
  };

  return (
    <SafeAreaView style={{ height:'100%', backgroundColor: "#fff" }}>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <View style={authStyle.main_container}>
          <View style={authStyle.view}>
            <Text h2 style={authStyle.pageTitle}>
              Вхід
            </Text>
            <Text style={authStyle.singInErrorContainer}>{errorMessage}</Text>
            <Input
              containerStyle={[authStyle.input, emailStyle]}
              labelStyle={[authStyle.lable]}
              placeholder="Email"
              label="Email"
              leftIcon={{ type: "fontisto", name: "email" }}
              value={email}
              onChangeText={(text) => {
                setEmail(text.replace(/\s/g, ""));
              }}
              onEndEditing={() => {
                setEmail((prevEmail) => {
                  return prevEmail.toLowerCase();
                });
                isNotValid();
              }}
              renderErrorMessage
              errorStyle={authStyle.errorText}
              errorMessage={emailErrorMessage}
            />
            <Input
              containerStyle={[authStyle.input, passwordStyle]}
              labelStyle={[authStyle.lable]}
              placeholder="Пароль"
              label="Пароль"
              leftIcon={{ type: "feather", name: "lock" }}
              value={password}
              onChangeText={(text) => {
                setPassword(text.replace(/\s/g, ""));
              }}
              onEndEditing={() => {
                setPasswordErrorMessage("");
                setPasswordStyle({});
              }}
              secureTextEntry
              renderErrorMessage
              errorStyle={authStyle.errorText}
              errorMessage={passwordErrorMessage}
            />
            {isLoading ? (
              <View>
                <Button
                  title="Вхід"
                  buttonStyle={[authStyle.button]}
                  titleStyle={[authStyle.buttonTitle]}
                  onPress={signInUser}
                  loading
                  loadingStyle={[authStyle.button]}
                  loadingProps={{ animating: true }}
                  disabled
                  disabledStyle={[authStyle.button]}
                />
                <Button
                  buttonStyle={[authStyle.button, authStyle.secondButton]}
                  title="Реєстрація"
                  titleStyle={[authStyle.buttonTitle, { color: "#FFA046" }]}
                  onPress={() => navigation.navigate("Sign Up")}
                  disabled
                  disabledStyle={{ backgroundColor: "#E3AC7A" }}
                />
              </View>
            ) : (
              <View>
                <Button
                  title="Вхід"
                  buttonStyle={[authStyle.button]}
                  titleStyle={[authStyle.buttonTitle]}
                  onPress={signInUser}
                />
                <Button
                  buttonStyle={[authStyle.button, authStyle.secondButton]}
                  title="Реєстрація"
                  titleStyle={[authStyle.buttonTitle, { color: "#FFA046" }]}
                  onPress={() => navigation.navigate("Sign Up")}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
