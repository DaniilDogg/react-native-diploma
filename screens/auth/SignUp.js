import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Button, Text } from "@rneui/base";
import { authStyle } from "./style";
import { auth } from "../../firebase/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export const SignUpScreen = ({ route, navigation }) => {
  const [code, setCode] = useState("");
  const [codeStyle, setCodeStyle] = useState({});
  const [codeErrorMessage, setCodeErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [emailStyle, setEmailStyle] = useState({});
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordStyle, setPasswordStyle] = useState({});
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmStyle, setPasswordConfirmStyle] = useState({});
  const [passwordConfirmErrorMessage, setPasswordConfirmErrorMessage] =
    useState("");

  const [isLoading, setIsLoading] = useState(false);

  let inputs = [true, true, true, true];
  const signUpUser = () => {
    if (!(inputs[0] && inputs[1] && inputs[2] && inputs[3])) return;
    let er = false;
    if (code == "") {
      setCodeErrorMessage("Invitation code cannot be empty.");
      setCodeStyle(authStyle.errorContainer);
      er = true;
    }
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
    if (passwordConfirm == "") {
      setPasswordConfirmErrorMessage("Password confirmation cannot be empty.");
      setPasswordConfirmStyle(authStyle.errorContainer);
      er = true;
    }
    if (er) {
      return;
    }
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        updateProfile(user, {
          displayName: null,
          photoURL: 'https://firebasestorage.googleapis.com/v0/b/react-native-diploma.appspot.com/o/avatars%2Fblank-profile-picture.jpg?alt=media&token=bfaababe-f3da-4461-ad2b-bbbe3099ca21',
        }).then(() => {
          navigation.navigate("CreateAccount");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage == "Firebase: Error (auth/email-already-in-use).") {
          setEmailErrorMessage("This email is already in use.");
          setEmailStyle(authStyle.errorContainer);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const checkCode = () => {
    if (code != "") {
      if (code != "Слава_Украине!") {
        inputs[0] = false;
        setCodeErrorMessage("Неправильный код");
        setCodeStyle(authStyle.errorContainer);
        return;
      }
    }
    setCodeErrorMessage("");
    setCodeStyle({});
    inputs[0] = true;
  };

  const checkEmail = () => {
    if (email != "") {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
      if (reg.test(email) === false) {
        inputs[1] = false;
        setEmailErrorMessage("Email is not Correct.");
        setEmailStyle(authStyle.errorContainer);
        return;
      }
    }
    setEmailErrorMessage("");
    setEmailStyle({});
    inputs[1] = true;
  };

  const checkPassword = () => {
    if (password != "") {
      inputs[2] = false;
      if (password.length < 8) {
        setPasswordErrorMessage(
          "The password must be at least 8 characters long."
        );
        setPasswordStyle(authStyle.errorContainer);
        return;
      }
      if ((password.match(/[A-Za-z_]/g) || []).length < 3) {
        setPasswordErrorMessage(
          "The password must contain at least three letters."
        );
        setPasswordStyle(authStyle.errorContainer);
        return;
      }
    }
    setPasswordErrorMessage("");
    setPasswordStyle({});
    inputs[2] = true;
    checkPasswordConfirm();
  };

  const checkPasswordConfirm = () => {
    if (passwordConfirm != "") {
      if (passwordConfirm != password) {
        inputs[3] = false;
        setPasswordConfirmErrorMessage("Password does not match.");
        setPasswordConfirmStyle(authStyle.errorContainer);
        return;
      }
    }
    setPasswordConfirmErrorMessage("");
    setPasswordConfirmStyle({});
    inputs[3] = true;
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <SafeAreaView style={authStyle.main_container}>
        <View style={authStyle.view}>
          <Text h3 style={authStyle.pageTitle}>
            Sing Up
          </Text>
          <Input
            labelStyle={[authStyle.lable]}
            placeholder="Your invitation code"
            label="Invitation code"
            leftIcon={{ type: "ionicon", name: "key-outline" }}
            value={code}
            onChangeText={(text) => setCode(text.replace(/\s/g, ""))}
            renderErrorMessage
            errorStyle={authStyle.errorText}
            errorMessage={codeErrorMessage}
            containerStyle={[authStyle.input, codeStyle]}
            onEndEditing={checkCode}
          />
          <Input
            labelStyle={[authStyle.lable]}
            placeholder="Email"
            label="Email"
            leftIcon={{ type: "fontisto", name: "email" }}
            value={email}
            onChangeText={(text) => setEmail(text.replace(/\s/g, ""))}
            renderErrorMessage
            errorStyle={authStyle.errorText}
            errorMessage={emailErrorMessage}
            containerStyle={[authStyle.input, emailStyle]}
            onEndEditing={()=>{
              setEmail((prevEmail)=>{
                return prevEmail.toLowerCase()
              })
              checkEmail()
            }}
          />

          <Input
            labelStyle={[authStyle.lable]}
            placeholder="Password"
            label="Password"
            leftIcon={{ type: "feather", name: "lock" }}
            value={password}
            onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
            secureTextEntry
            renderErrorMessage
            errorStyle={authStyle.errorText}
            errorMessage={passwordErrorMessage}
            containerStyle={[authStyle.input, passwordStyle]}
            onEndEditing={checkPassword}
          />
          <Input
            labelStyle={[authStyle.lable]}
            placeholder="Confirm the password"
            label="Password"
            leftIcon={{ type: "feather", name: "lock" }}
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text.replace(/\s/g, ""))}
            secureTextEntry
            renderErrorMessage
            errorStyle={authStyle.errorText}
            errorMessage={passwordConfirmErrorMessage}
            containerStyle={[authStyle.input, passwordConfirmStyle]}
            onEndEditing={checkPasswordConfirm}
          />
          {isLoading ? (
            <View>
              <Button
                title="Sign Up"
                buttonStyle={[authStyle.button]}
                titleStyle={[authStyle.buttonTitle]}
                onPress={signUpUser}
                loading
                loadingStyle={[authStyle.button]}
                loadingProps={{ animating: true }}
                disabled
                disabledStyle={[authStyle.button]}
              />
              <Button
                buttonStyle={[authStyle.button, authStyle.secondButton]}
                title="Sign In"
                titleStyle={[authStyle.buttonTitle, { color: "#007AFF" }]}
                onPress={() => navigation.navigate("Sign In")}
                disabled
              />
            </View>
          ) : (
            <View>
              <Button
                title="Sign Up"
                buttonStyle={[authStyle.button]}
                titleStyle={[authStyle.buttonTitle]}
                onPress={signUpUser}
              />
              <Button
                buttonStyle={[authStyle.button, authStyle.secondButton]}
                title="Sign In"
                titleStyle={[authStyle.buttonTitle, { color: "#007AFF" }]}
                onPress={() => navigation.navigate("Sign In")}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
