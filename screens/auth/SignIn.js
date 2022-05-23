import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { auth } from "../../firebase/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Text } from "@rneui/base";
import { authStyle } from "./style";

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
      setEmailErrorMessage("Email cannot be empty.");
      setEmailStyle(authStyle.errorContainer);
      er = true;
    }
    if (password == "") {
      setPasswordErrorMessage("Password cannot be empty.");
      setPasswordStyle(authStyle.errorContainer);
      er = true;
    }
    if (er || isNotValid()) {
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email.toLowerCase(), password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        if (user.displayName === null) {
          navigation.navigate("CreateAccount");
        } else {
          navigation.replace("DrawerScreen");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage("That email and password combination is incorrect.");
      })
      .finally(() => setIsLoading(false));
  };

  const isNotValid = () => {
    if (email != "") {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        inputs[0] = false;
        setEmailErrorMessage("Email is not Correct.");
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
            <Text h3 style={authStyle.pageTitle}>
              Sign In
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
              placeholder="Password"
              label="Password"
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
                  title="Sign In"
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
                  title="Sign Up"
                  titleStyle={[authStyle.buttonTitle, { color: "#FFA046" }]}
                  onPress={() => navigation.navigate("Sign Up")}
                  disabled
                  disabledStyle={{ backgroundColor: "#E3AC7A" }}
                />
              </View>
            ) : (
              <View>
                <Button
                  title="Sign In"
                  buttonStyle={[authStyle.button]}
                  titleStyle={[authStyle.buttonTitle]}
                  onPress={signInUser}
                />
                <Button
                  buttonStyle={[authStyle.button, authStyle.secondButton]}
                  title="Sign Up"
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
