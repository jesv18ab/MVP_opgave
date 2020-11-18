import React, { Component } from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
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
    handleLogOut = async () => {
        await firebase.auth().signOut();
    };

    getHouseHoldName = () => {
        const listOfhouseHolds = Object.values(this.state.houseHolds);
        const listOfKeys = Object.keys(this.state.houseHolds);
        const currentUser = this.getCurrentUser();
        var keyFound = null;
        var houseHoldName = null;
        listOfhouseHolds.map((item, index) => {
            if (listOfKeys[index] === currentUser.houseHoldId){
                keyFound = listOfKeys[index];
            }
        });
        firebase.database().ref(`/households/${keyFound}`).on('value', snapshot => {
                houseHoldName = snapshot.val();
            }
        );
        return houseHoldName;
    };

    getCurrentUser = () => {
        let keyFound = null;
        let currentUser = null;
        const listOfUsers = Object.values(this.state.allUsers);
        listOfUsers.map((item, index) => {
            if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                currentUser = listOfUsers[index];
            }
        });
        return currentUser
    };

    //Metoden står for at gemme data fra en array i min firebase DB
    handleSave = () => {
        let isValidated = null;
        let isValidatedKey = null;
        var usersFromHouseHold = [];
        const allUsers = Object.values(this.state.allUsers);
        const keys = Object.keys(this.state.allUsers);
        const currentUser = this.getCurrentUser();
        const id = currentUser.houseHoldId;
        const houseHoldName = this.getHouseHoldName();
        let checkMail = this.state.email;
        console.log(checkMail);
        firebase.database().ref(`/households/${currentUser.houseHoldId}/users`).on('value', snapshot => {
                usersFromHouseHold = snapshot.val();
            }
        );
        const houseHoldUsers = Object.values(usersFromHouseHold);
            allUsers.map((item, index) => {
                if (item.email.toUpperCase() === checkMail.toUpperCase()){
                    isValidated = allUsers[index];
                    isValidatedKey = keys[index];

                }
            });
            const reference = firebase.database().ref(`/allInvitations/`).push({sender: currentUser.email, receiver: isValidated.email, houseHoldName: houseHoldName.houseHoldName, houseHoldId: currentUser.houseHoldId, status: "not replied"});
        try {
            // const reference = firebase.database().ref(`/households/${id}`).set({houseHoldName, users});
        } catch (error) {
            Alert.alert(`Error: ${error.message}`);
        }
    };


    componentWillUnmount() {
        this._isMounted = false;
    }

    //her er kun design utviklet enn så lenge - ikke logikk. Lager input felt, som skal ta vare på fremtidige nye brukere.
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Invite your friend!</Text>
                <Text style={styles.textSubmit}>Submit</Text>

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
        fontSize: 35,
        bottom:190,
        fontWeight:'bold',
        marginTop:20,
        marginBottom:20,
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














