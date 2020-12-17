import React, { Component } from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';

export default class AddMemberView extends React.Component{
    _isMounted = false;

    //Her instantieres state variabler for klassen
    state = {
        usersToAdd: [],
        newUserAdded: '',
        allUsers: [],
        houseHolds: [],
        email: null
    };

    //I componentdidmount henter vi alle brure og alle households
    componentDidMount() {
        this._isMounted = true;
        firebase.database().ref('/allUsers/').on('value', snapshot => {
                this.setState({ allUsers: snapshot.val() });
            }
        );
        firebase.database().ref('/households/').on('value', snapshot => {
                this.setState({ houseHolds: snapshot.val() });
            }
        );
    }

    //Håndtering af logout
    handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    //Her henter vi householdname
    getHouseHoldName = () => {

        //Vi opretter en liste over alle households og slle keys for households.
        //DErudover gemmes den nuværende bruger i en const varabel
        const listOfhouseHolds = Object.values(this.state.houseHolds);
        const listOfKeys = Object.keys(this.state.houseHolds);
        const currentUser = this.getCurrentUser();

      //Initialisering af variabler til nøgle og householdname
        var keyFound = null;
        var houseHoldName = null;

       //Vi looper igennem aller households og tester, hvorvidt den nuværende brugers householdId er ligmed det, som findes
        //I listen af nøgler. Når et match er fundet gemmes nøglen i den præinitialiserede variabel
        listOfhouseHolds.map((item, index) => {
            if (listOfKeys[index] === currentUser.houseHoldId){
                keyFound = listOfKeys[index];
            }
        });

        //Ved brug af den fundne nøgle hentes householdname
        firebase.database().ref(`/households/${keyFound}`).on('value', snapshot => {
                houseHoldName = snapshot.val();
            }
        );

        //Kollektivnavnet returneres
        return houseHoldName;
    };

    //Her hentes den nuværende bruger
    getCurrentUser = () => {

        //Initialisering af variable til den nurværende bruger og tilhørende nøgle
        let keyFound = null;
        let currentUser = null;
        //Vi henter alle brugere og placerer disse i en liste
        const listOfUsers = Object.values(this.state.allUsers);
        //Vi looper igennem alle brugere og tjekker hvorvidt det enkltes objekt email værdi stemmer overens med den nuværende brugeres
        listOfUsers.map((item, index) => {
            if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                currentUser = listOfUsers[index];
            }
        });

        //Her returneres den fundne bruger
        return currentUser
    };

    //Metoden står for at gemme data fra en array i min firebase DB
    handleSave = () => {
       //Vi initialisere en række variabler og gemmer en række værdier, der skal anvendes
        let isValidated = null;
        let isValidatedKey = null;
        var usersFromHouseHold = [];
        const allUsers = Object.values(this.state.allUsers);
        const keys = Object.keys(this.state.allUsers);
        const currentUser = this.getCurrentUser();
        const id = currentUser.houseHoldId;
        const houseHoldName = this.getHouseHoldName();
        let checkMail = this.state.email;

        //Vi henter alle brugere i et  og gemmer disse i en state
        firebase.database().ref(`/households/${currentUser.houseHoldId}/users`).on('value', snapshot => {
                usersFromHouseHold = snapshot.val();
            }
        );

        const houseHoldUsers = Object.values(usersFromHouseHold);

        //Vi looper igennem aller brugere
            allUsers.map((item, index) => {

               //Vi en email i listen stemmer overens med den nuværende brugers email, hetnes brugeres og vedkommende nøgle
                if (item.email.toUpperCase() === checkMail.toUpperCase()){
                    isValidated = allUsers[index];
                    isValidatedKey = keys[index];
                }
            });

            //Her opretter vi en invitation med alle de oplysninger der er fundet ved brug af de ovenstående metoder
            const reference = firebase.database().ref(`/allInvitations/`).push({sender: currentUser.email, receiver: isValidated.email, houseHoldName: houseHoldName.houseHoldName, houseHoldId: currentUser.houseHoldId, status: "not replied"});
        try {
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };


    componentWillUnmount() {
        this._isMounted = false;
    }

    //I render opbygges siden.
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Invite your friend!</Text>
               <View style={{ bottom: 80}} >
                <AntDesign name="addusergroup" size={110} color="purple" />
               </View>
                <TextInput
                    value={this.state.email}
                    keyboardType = 'email-address'
                    onChangeText={(email) => this.setState({ email })}
                    placeholder='Email'
                    placeholderTextColor = 'grey'
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleSave}>
                    <Text style={styles.buttonText}>Invite your friend</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}> By register you agree to the terms</Text>


            </View>
        );
    }
}


//her legges style til
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
    },


    button: {
        alignItems: 'center',
        backgroundColor: '#47525E',
        width: 250,
        height: 54,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginTop:7,
        bottom:50,
    },
    buttonText:{
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 250,
        fontSize: 15,
        height: 50,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,
        bottom:50,
    },

    text: {
        fontSize: 45,
        bottom:120,
        fontWeight:'bold',
        marginBottom:5,
        color:'#5FB8B2',
    },

    textSubmit:{
        fontSize: 20,
        color:'black',
        bottom:60,
        fontWeight:'bold',
        alignItems: 'center',
    },

    termsText:{
        color:'grey',
        marginTop: 5,
        bottom:35,
    },



});














