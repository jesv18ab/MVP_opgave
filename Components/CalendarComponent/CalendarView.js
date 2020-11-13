import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Alert, TouchableOpacity, Image, Linking, Modal, TouchableHighlight, TextInput, Button} from 'react-native';
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
            makeEvent: null,
            setModalVisible: false
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    //Alert som kan anvendes, hvis man vælger en dato
    //Er ikke brugt
    makeEvent =() =>{
        console.log(this.state.setModalVisible)
        if (this.state.setModalVisible === false){
            this.setState({setModalVisible: true})
        } else if(this.state.setModalVisible === true) {
            this.setState({setModalVisible: false})
        }
    };
    //Metoder som håndtere skiftende datoer
    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });
        this.showAlert()
    }
    calendar = () => {
        try {
            Linking.openURL('https://calendar.google.com/calendar/u/0/r')
        } catch (e) {
            console.log(e.message);
        }
    };

    showAlert = () => {
        Alert.alert(
            'Aviso',
            '¿Desea cerrar la sesion?',
            [
                {text: 'Opret begivenhed', onPress: () => this.setState({setModalVisible: true})},
                {text: 'Cancel', onPress: () => alert('Cancel Pressed'), style: 'cancel'},
            ],
            { cancelable: false }
        )
    }


    //I render instantieres en CalenderPicker komponent, der fremviser en kalender
    //Kalender har en property, som kan registrere valg af datoer, som forekommer ved tryk på skærmen
    render() {
        const { selectedStartDate, modalVisible, setModalVisible } = this.state;
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
                <View style={styles.container}>
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={setModalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}>
                    <View style={{height: 300, width: 300, backgroundColor: 'white', margin:'15%'}}>
                        <TextInput
                            placeholder="email"
                            style={styles.inputField}
                        />
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={this.makeEvent}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </TouchableHighlight>
                            <Button title="Set false" onPress={this.makeEvent} />
                        </View>
                    </View>
                </Modal>
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
    },
    inputField: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
    },
});
