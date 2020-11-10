import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HeaderNav from "../HeaderNav";
import firebase from "firebase";


export default class ProfileView extends React.Component{

//Denne metode henter den bruger, som er valideret under login
    //Der er ikke blevet brugt tid på design eller anden funktionalitet i klassen
    getUser = () =>{
        var currentUser = null;
        try {
             currentUser =  firebase.auth().currentUser;
             console.log("CurrentUser" + currentUser)
        }catch (e) {
            console.log(e.message)
        }
        return currentUser
    };

    render(){
        const currentUser = this.getUser();
        return(
            <View style={{marginTop: 30}}>
                <HeaderNav title ={currentUser.email} />
                <View style={styles.container}>
                <Text>Profile View / Test Henri</Text>
            </View>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
});
