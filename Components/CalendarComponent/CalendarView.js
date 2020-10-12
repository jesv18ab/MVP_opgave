import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import HeaderNav from "../HeaderNav";

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
    //I render instantieres en CalenderPicker komponent, der fremviser en kalender
    //Kalender har en property, som kan registrere valg af datoer, som forekommer ved tryk på skærmen
    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <View style={{marginTop: 30}} >
                <HeaderNav title="Kalender" />
                <View style={{marginTop: 40}}>
                <CalendarPicker style={{marginTop: 500}} onDateChange={this.onDateChange}/>
                </View>
                <View>
                    <Text>SELECTED DATE:{ startDate }</Text>
                </View>
            </View>
        );
    }
}


