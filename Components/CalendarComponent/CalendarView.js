import React, { Component } from 'react';
import {
    StyleSheet, Text, View, Alert, TouchableOpacity, Image, Linking, Modal, TouchableHighlight, TextInput, Button} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import HeaderNav from "../HeaderNav";
import TimePicker from "react-native-simple-time-picker";
import { format } from "date-fns";
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
            setModalVisible: false,
            selectedHours: 12,
            selectedMinutes: 0,
            show: false,
            chosenHours: "",
            chosenMinutes: ""
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
        let date_string = date.toString();
        let dateArray = [];
        let output = date_string.split('');
        output.map((item, index) => {
            if (index < 10 ){
                dateArray.push(item);
            }
        });
        let date_formatted = dateArray.join("");
        console.log(date_formatted);
        this.setState({
            selectedStartDate: date_formatted,
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
    };


showTimePicker =() => {
    this.setState({show: true})
};

    timePicked = () => {
        this.setState({});
        this.setState({chosenHours: this.state.selectedHours});
        this.setState({chosenMinutes: this.state.selectedMinutes})
    };

    //I render instantieres en CalenderPicker komponent, der fremviser en kalender
    //Kalender har en property, som kan registrere valg af datoer, som forekommer ved tryk på skærmen
    render() {

        const { selectedHours, selectedMinutes, show, chosenHours } = this.state;
        const { selectedStartDate, modalVisible, setModalVisible } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';

        return (
            <View>
            <View style={{marginTop: 30}} >
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
                    <View style={styles.eventBox}>
                        <View style={{alignItems: 'center', justifyContent: 'center',}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold'}} >Opret begivenhed</Text>
                        </View>
                     <View>
                        <TextInput
                            placeholder={startDate.toString()}
                            value={startDate.toString()}
                            editable={false}
                            style={styles.inputField}/>
                        <TextInput
                            placeholder="Tidspunkt"
                            value={chosenHours.toString()}
                            onChangeText={(chosenHours) => this.setState({ chosenHours })}
                            style={styles.inputField}
                            editable={false}
                        />
                        <Button title={"Sæt et tidspunkt"} onPress={this.showTimePicker} />
                     </View>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Hello World!</Text>
                            <TouchableHighlight
                                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                onPress={this.makeEvent}>
                                <Text style={styles.textStyle}>Hide Modal</Text>
                            </TouchableHighlight>
                            <Button title="Set false" onPress={this.makeEvent} />
                            {show &&(
                                <View style={{backgroundColor: 'white'}}>
                                    <TimePicker
                                        selectedHours={selectedHours}
                                        selectedMinutes={selectedMinutes}
                                        onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
                                    />
                                    <Button title="færdig" onPress={this.timePicked} />
                                </View>
                            )}
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
    eventBox: {

        height: 300,
        width: 300,
        backgroundColor: 'white',
        margin:'15%',
        marginTop: '25%',
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        elevation: 1,
    }
});
