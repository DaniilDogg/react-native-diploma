import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  GiftedChat,
  InputToolbar,
  SystemMessage,
  Bubble,
  Message,
  MessageText,
  Time,
  Composer,
} from "react-native-gifted-chat";
import { StyleSheet, View, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon, Text } from "@rneui/base";
import { auth, firestore } from "../../../firebase/firebase-config";
import {
  collection,
  addDoc,
  orderBy,
  onSnapshot,
  query,
  doc,
  get,
  getDoc,
} from "firebase/firestore";

export const ChatScreen = (props) => {
  const massageContainerColor = "#E8B974";
  const selfMassageContainerColor = "#A2A7B9";
  const maxWidth = Dimensions.get("window").width * 0.75;
  const [messages, setMessages] = useState([]);
  const userColor = new Map();
  const colors = [
    "#E31EF7",
    "#427EFF",
    "#2BE219",
    "#FF1717",
    "#0017FF",
    "#00DAD6",
  ];

  const users_data = new Map();

  useLayoutEffect(() => {
    const collectionRef = collection(
      firestore,
      `/chats/${props.route.params.key}/${props.route.params.task_id}`
    );
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const msgs = await Promise.all(
        querySnapshot.docs.map(async (document) => {
          const message = {
            _id: document.data()._id,
            createdAt: document.data().createdAt.toDate(),
            text: document.data().text,
            user: document.data().user,
          };

          if (!users_data.has(message.user._id)) {
            const docRef = doc(firestore, "users", message.user._id);
            const data = await getDoc(docRef);
            users_data.set(message.user._id, data.data());
          }

          message.user.name = users_data.get(message.user._id).displayName;
          message.user.avatar = users_data.get(message.user._id).photoURL;
          message.user.admin = users_data.get(message.user._id).admin;

          return message;
        })
      );
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text, user } = messages[0];
    addDoc(
      collection(
        firestore,
        `/chats/${props.route.params.key}/${props.route.params.task_id}`
      ),
      {
        _id,
        createdAt,
        text,
        user,
      }
    );
  }, []);


  const [inputLenght, setInputLenght] = useState(0)

  const CustomInputToolbar = (props) => {

    const _onSend = (props) => {
      if (props.text.trim() == "") {
        return;
      }
      props.onSend({ text: props.text.trim() }, true);
    };

    const SendButton = (props) => {
      if (props.text.trim() != "") {
        return (
          <View style={{marginRight: 1}}>
            <Button
              buttonStyle={[styles.sendButton]}
              title = {'10/10'}
              icon={<Icon type="ionico" name="send" size={35} color="#FF8F19" />}
              onPress={() => _onSend(props)}
            >
              <Text style={{position:'absolute', bottom: 0, left: 30, fontSize:12, color: inputLenght >= 255 ? 'red' : 'black'}}>{inputLenght}/255</Text>
            </Button>            
          </View>
        );
      }
    };

    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#C08F61",
          borderTopWidth: 1,
          minHeight: 55,
          justifyContent: "center",
          alignItems: "stretch",
        }}
        renderSend={SendButton}
        renderComposer={CustomComposer}
      />
    );
  };

  const CustomComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          textAlign: "justify",
          textAlignVertical: "center",
        }}
        onTextChanged={(text)=>{
          if(text.length >= 256){
            return
          }
          props.onTextChanged(text)
          setInputLenght(text.length)
        }}
      />
    )
  }

  const CustomMessage = (props) => (
    <Message
      {...props}
      /*
      containerStyle={{
        left: { backgroundColor: "lime" },
        right: { backgroundColor: "gold" },
      }}
      */
    />
  );

  const CustomMessageText = (props) => (
    <MessageText
      {...props}
      containerStyle={{
        left: { backgroundColor: massageContainerColor },
        right: { backgroundColor: selfMassageContainerColor },
      }}
      /*
      textStyle={{
        left: { color: 'red' },
        right: { color: 'green' },
      }}
      linkStyle={{
        left: { color: 'orange' },
        right: { color: 'orange' },
      }}
      */
      customTextStyle={{ fontSize: 16, lineHeight: 24 }}
    />
  );

  const CustomBubble = (props) => {
    const isAdmin = props.currentMessage.user.admin;
    const checkUser = props.currentMessage.user._id != props.user._id;
    const checkMassage =
      props?.previousMessage?.user?._id != props.currentMessage.user._id;
    const checkNextMassage =
      props.currentMessage.user?._id == props?.nextMessage?.user?._id;

    const UserName = (props) => {
      const name = props.currentMessage.user.name;
      const id = props.currentMessage.user._id;
      if (!userColor.has(id)) {
        userColor.set(id, colors[userColor.size % colors.length]);
      }
      const color = userColor.get(id);
      return (
        <Text
          style={{
            alignSelf: "flex-start",
            color: color,
            fontSize: 15,
            fontWeight: "normal",
            paddingTop: 5,
            paddingLeft: 5,
            paddingRight: 5,
            width: "auto",
          }}
        >
          {name}
        </Text>
      );
    };

    const viewStyle = StyleSheet.create({
      all: {
        minWidth: 75,
        maxWidth: maxWidth,
        borderRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "flex-end",
      },
      admin:{
        minWidth: 115,
      },
      left: {
        padding: 0,
        alignSelf: "flex-start",
        alignItems: "flex-start",
        width: "auto",
        backgroundColor: massageContainerColor,
        borderTopLeftRadius: 10,
      },
    });

    const formatAMPM = (date) => {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    };
    return (
      <View
        style={[
          viewStyle.all,
          checkUser ? viewStyle.left : {},
          isAdmin ? viewStyle.admin : {},
          checkNextMassage
            ? { borderBottomLeftRadius: 0 }
            : { marginBottom: 15 },
        ]}
      >
        {checkUser && checkMassage && UserName(props)}
        <Bubble
          {...props}
          /*     
        containerStyle={{
          left: { borderColor: 'teal', borderWidth: 8, borderTopRightRadius: 10},
          right: {},
        }}
        */
          wrapperStyle={{
            left: {
              marginRight: 0,
              width: "100%",
              borderTopRightRadius: 10,
              overflow: "hidden",
            },
            right: {
              width: "100%",
              overflow: "hidden",
              backgroundColor: selfMassageContainerColor,
            },
          }}
          bottomContainerStyle={{
            left: { alignSelf: "flex-end", display: "none" },
            right: {},
          }}
          containerToNextStyle={{
            left: { borderTopRightRadius: 10 },
            right: {},
          }}
          containerToPreviousStyle={{
            left: { borderTopRightRadius: 10, borderTopLeftRadius: 0 },
            right: {},
          }}
        ></Bubble>
        {checkUser && (
          <View style={{ flex: 1, width: "auto", flexDirection:'row', alignItems: 'center', paddingBottom: 3 }}>
            {isAdmin && (
              <Text
                style={{
                  color: "#000",
                  fontSize: 12,
                  textAlign: "left",
                  paddingLeft: 7,
                  paddingRight: 7,
                }}
              >
                Admin
              </Text>
            )}
            <Text
              style={{
                flex: 1,
                color: "#000",
                fontSize: 11,
                minWidth: 60,
                textAlign: "right",                
                paddingRight: 7,
              }}
            >
              {formatAMPM(props.currentMessage.createdAt)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const CustomTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: "#000",
            fontSize: 11,
            textAlign: "right", // or position: 'right'
          },
          right: {
            color: "#000",
            fontSize: 11,
            textAlign: "right", // or position: 'right'
          },
        }}
      />
    );
  };

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={false}
      onSend={(messages) => onSend(messages)}
      renderInputToolbar={(props) => CustomInputToolbar(props)}
      renderUsernameOnMessage={true}
      renderAvatarOnTop={true}
      user={{
        _id: auth?.currentUser?.uid,
      }}
      listViewProps={{
        style: {
          backgroundColor: "#EBE0D4",
        },
      }}
      textInputStyle={styles.inputStyle}
      renderMessage={CustomMessage}
      renderMessageText={CustomMessageText}
      renderBubble={CustomBubble}
      renderTime={CustomTime}
      renderComposer={CustomComposer}
    />
  );
};

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: "",
    width: 80,
  },
  inputStyle: {
    fontSize: 16,
    lineHeight: 25,
  },
});
