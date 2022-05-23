import React from 'react';
import {StyleSheet} from 'react-native';
export const authStyle = StyleSheet.create({
    main_container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    view: {
      flex: 0,
      width: '100%',
    },
    pageTitle:{
      alignSelf: 'center',
      marginBottom: 10,
      marginTop: 15,
    },
    lable:{
      color: '#000',
      fontWeight: 'normal',
    },
    buttonTitle: {
      marginVertical: 2,
      fontSize: 22,
    },
    input:{
      marginVertical: 3,
      borderWidth: 2,
      borderColor: '#fff',
    },
    button: {
      alignSelf: 'center',
      width: '70%',
      backgroundColor: '#FFA046',
      borderColor: '#FFA046',
      borderWidth: 1,
      borderRadius: 10,
      marginVertical: 7,
      height: 60,
    },
    secondButton: {
      backgroundColor: '#fff',
    },
    errorContainer:{
      borderColor: 'red',
      borderWidth: 2,
    },
    errorText:{
      fontSize: 16
    },
    singInErrorContainer:{
      fontSize: 16,
      color: 'red',
      alignSelf: "center",
      marginTop: 5,
      marginBottom: 10,
      height: 45,
      textAlign: 'center'
    },
  });