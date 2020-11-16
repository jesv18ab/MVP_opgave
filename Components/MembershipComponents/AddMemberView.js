import React, { Component } from 'react';
import { Alert, Button, Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';

export default class AddMemberView extends React.Component{
    state = {
        name: '',
        email: '',
    };

    onLogin() {
        const {name, email } = this.state;
        Alert.alert('Credentials',` name: ${name} + email: ${email} `);
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
                    style={styles.input}/>


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
                    onPress={this.onLogin.bind(this)}
                >
                    <Text style={styles.buttonText}>Invite your friend</Text>
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














