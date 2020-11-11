import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity, Image, Linking} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import HeaderNav from "../HeaderNav";
import {Entypo} from "@expo/vector-icons";


//Kalender klassen er en eksternt hentet komponent, som ikek er blevet tilpasset til porjektet endnu
//Selve designet er under overvejelser, men er ikke fuldstændig fastlagt.
export default class CalendarView extends Component {

    //Der oprettes en constructor, der tager props med som argument
    //Derudocer sættes startværdier for state variablen.
    //Slutteligt oprettes der metoder til at håndtere skift i datovalg
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    //Alert som kan anvendes, hvis man vælger en dato
    //Er ikke brugt
    makeAlert =() =>{
        Alert.alert("ramt");
    }

    //Metoder som håndtere skiftende datoer
    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });
    }
    calendar = () => {
        try {
            Linking.openURL('https://calendar.google.com/calendar/u/0/r')
        } catch (e) {
            console.log(e.message);
        }
    };

    //I render instantieres en CalenderPicker komponent, der fremviser en kalender
    //Kalender har en property, som kan registrere valg af datoer, som forekommer ved tryk på skærmen
    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <View>
            <View style={{marginTop: 30}} >
                <HeaderNav title="Kalender" />
                <View style={{marginTop: 40}}>
                <CalendarPicker style={{marginTop: 500}} onDateChange={this.onDateChange}/>
                </View>
                <View>
                    <Text>SELECTED DATE:{ startDate }</Text>
                </View>
                </View>
                <View>
    <TouchableOpacity style={[styles.iconButtonsFacebook,]} onPress={this.calendar}>
        <Text>Google kalender</Text>
        <Image source={require('./assetsCalendar/GoogleCalendar.png')} style={{ width: 38, height: 38 }}/>
    </TouchableOpacity>
            </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
    },
    iconButtonsFacebook: {
        alignItems: 'center',
        borderColor:'#47525E',
        width: 140,
        height: 84,
        borderWidth:1,
        borderRadius: 5,
        bottom:65,
        padding:10,
        left:80,
        marginTop: 200
    },

    buttonText:{
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },


    sigUpButton:{
        alignItems: 'center',
        width: 280,
        height: 54,
        padding: 10,
        borderRadius: 5,
        bottom:60,



    }
});
