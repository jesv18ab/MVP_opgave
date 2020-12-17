
//Imports
import React, { Component } from 'react';
import {Button, View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';

//Vi opretter en klasse for gæstebrugere
export default class InitalViewNewUsers extends Component {


//Dette view skal være en navigationsside, hvor brugerne kan vælge om de vil går til oprettelse af et ny kollektiv
    //Eller om de vil gå ind og se alle deres invitationer

   //Metoden fører brugeren ind til oprettelse af et kollektiv
    gotToCreate = () => {
        this.props.navigation.navigate('CreateHouseHold');
    };

    //Metoden fører brugeren ind til alle invitationer
    gotToInvitations = () => {
        this.props.navigation.navigate('MyInvites');
    };

    //I render iobygges siden
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Bliv en del af et  </Text>
                <Text style={styles.headerText}>kollektiv  </Text>

                <View style={{ flex: 1, flexDirection: 'row', top: '5%'}}>
                    <TouchableOpacity style={{width: '40%', height: '20%', backgroundColor: '#47525E',   borderRadius: 10,
                        overflow: 'hidden', right: 10, top: 80, alignItems: 'center', justifyContent: 'center' }} onPress={this.gotToCreate}>
                        <Entypo name="home" size={50} color="white" />

                        <Text style={{color: 'white', fontSize: 18}}>Opret kollektiv</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width: '40%', height: '20%', backgroundColor: '#47525E',   borderRadius: 10,
                        overflow: 'hidden', left: 10,  top: 80, alignItems: 'center', justifyContent: 'center' }} onPress={this.gotToInvitations}>
                        <MaterialCommunityIcons name="email-newsletter" size={50} color="white" />
                        <Text style={{color: 'white', fontSize: 18}}>Se invitationer</Text>

                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}

//Styling til alle komponenter i render
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
        width: '100%',
        height: '100%',
    },
    buttonContainer: {
        height: '10%',
        width: 10,
        backgroundColor: '#767577'
    },
    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
    },
});
