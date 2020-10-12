//Vi husker de nødvendige imports
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SignInForm from "./Components/SignInForm";
import * as firebase from 'firebase';

//Oprettelse af databasekonfiguration
const fireBaseConfig = {
  apiKey: "AIzaSyAhRw12K9lOP1p72bY_Pqpol5VjohVULAM",
  authDomain: "reactnativedbtrial.firebaseapp.com",
  databaseURL: "https://reactnativedbtrial.firebaseio.com",
  projectId: "reactnativedbtrial",
  storageBucket: "reactnativedbtrial.appspot.com",
  messagingSenderId: "747875825609",
  appId: "1:747875825609:web:6fb0e13809e67b47151a18",
  measurementId: "G-DBNS46ZC4T"
};
// Vi kontrollerer at der ikke allerede er en initialiseret instans af firebase
// Så undgår vi fejlen Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
if (!firebase.apps.length) {
  firebase.initializeApp(fireBaseConfig);
}

//Oprettelse af klassse
export default class App extends React.Component  {
  //Vi instantierer SignInform i vores App.js, da det er her, applikationen skal starte
  render(){
    return(
        <SignInForm/>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
