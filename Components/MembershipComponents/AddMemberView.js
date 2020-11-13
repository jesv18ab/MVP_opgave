import React, { Component } from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import * as firebase from 'firebase';


export default class AddMemberView extends React.Component{
    _isMounted = false;

    //Her instantieres state variabler for klassen
    state = {
        membersToAdd: [],
        usersToAdd: [],
        newUserAdded: '',
        allUsers: [],
        houseHolds: [],
        email: "",
        name: ""
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
    //    let isValidatedKey = null;
     //   var usersFromHouseHold = [];
     //   var validatedUsers= [];
       // var validatedUsersKeys = [];
       // var users = [];
      //  var checkVariable = false;
        //let user = null;
        //const listToAdd = this.state.membersToAdd;
        const allUsers = Object.values(this.state.allUsers);
        //const keys = Object.keys(this.state.allUsers);
        const currentUser = this.getCurrentUser();
        const id = currentUser.houseHoldId;
        const houseHoldName = this.getHouseHoldName();

        console.log(this.state.email);
        //Altså sammen er fra en liste struktur
        /*firebase.database().ref(`/households/${currentUser.houseHoldId}/users`).on('value', snapshot => {
                usersFromHouseHold = snapshot.val();
            }
        );*/
     /*   const houseHoldUsers = Object.values(usersFromHouseHold);
        for (let user of houseHoldUsers){
            users.push(user)
        }*/
     /*   for (let checkMail of listToAdd) {

        }*/

        allUsers.map((item, index) => {
            if (item.email.toUpperCase() === this.state.email.toUpperCase()){
                isValidated = this.state.email
                //NEdenstående kan bruges vil man vil lave en liste af invitationer sstedet for at invitere enkeltvis
                //  isValidatedKey = keys[index];
                //validatedUsers.push(checkMail);
                //validatedUsersKeys.push(isValidatedKey);
            }
        });
        console.log(currentUser)
        const reference = firebase.database().ref(`/allInvitations/`).push({sender: currentUser.email, receiver: isValidated, houseHoldName: houseHoldName.houseHoldName, houseHoldId: currentUser.houseHoldId, status: "not replied"});
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
                    value={this.state.name}
                    onChangeText={(name) => this.setState({ name })}
                    placeholder='Full name'
                    placeholderTextColor = 'grey'
                    style={styles.input}
                />


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
                    <Text style={styles.buttonText}>Inviter roommates</Text>
                </TouchableOpacity>

                <Text style={styles.termsText}>By creating an account you agree to the terms </Text>



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
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,
    },

    text: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
        bottom:100,
    },

    textSubmit:{
        fontSize: 25,
        color:'black',
        bottom:10,
        alignItems: 'center',
    },

    termsText:{
        color:'grey',
        marginTop: 10
    },



});














