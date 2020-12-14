import {StyleSheet, Text, View, Button, TextInput, Switch} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";
import AsyncStorage from '@react-native-community/async-storage';
import HeaderEvents from "../CalendarComponent/HeaderEvents";
import { FontAwesome5, Entypo } from '@expo/vector-icons';

//Der er ikke brugt tid på funktionalitet eller design af denne klasse
//Klassen vil blive lavet på et senere tidspunkt.


const Status1 =
    <View style={{alignItems: 'center', backgroundColor: 'white', width: '38%'}}>
        <Text>Ikke sat igang</Text>
        <FontAwesome5 name="smile" size={24} color='green'/>
    </View>

const Status2 =
    <View style={{alignItems: 'center', backgroundColor: 'white', width: '38%'}}>
        <Text>Starter snart </Text>
        <FontAwesome5 name="surprise" size={24} color="yellow" />
    </View>

const Status3 =
    <View style={{alignItems: 'center', backgroundColor: 'white', width: '38%'}}>
        <Text>Er sat igang i dag</Text>
        <Entypo name="emoji-sad" size={24} color="red" />
    </View>


export default class LandryView extends React.Component {

    state = ({
            switchItems: [{ date: '13:30', name: 'Sarah Hansen', status: Status1}, { date: '12:00', name: 'Hans Hansen', status: Status2}, { date: '09:00', name: 'Signe Emilie', status: Status3}   ] }
                )
                    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.headerText}>Tid til en vask :-) </Text>
                <View style={{width: '100%', height: '7%', backgroundColor: '#47525E', top: '3%', alignItems: 'center', justifyContent: 'center'}} >
                    <Text style={{color: 'white', fontSize: 25}} >Planlagte vaske</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', top: '10%' }}>
                    <View style={styles.row} >
                        <Text>Person</Text>
                    </View>
                    <View style={styles.row} >
                        <Text>Tider i dag </Text>
                    </View>
                    <View style={styles.row}>
                        <Text> Status</Text>
                    </View>
                </View>
                <View style={{ bottom: '22.5%', height: '50%' }}>
                    {this.state.switchItems.map((item, index) => (
                        <View style={{ flexDirection: 'row', width: "90%",  alignItems: 'center'  }}>
                            <TextInput editable = {false} value={item.name} style={{backgroundColor: 'white', width: '33%', height: 45, left: 5,   textAlign: 'center', color: 'black'   }}   />
                            <TextInput editable = {false} value={item.date} style={{backgroundColor: 'white', width: '33%', height: 45, marginBottom: 10, textAlign: 'center',  top: 5, color: 'black'   }} />
                            {item.status}
                        </View>
                    ))}
                </View>
            </View>
        )
                    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
        width: '100%',
        height: '100%'
    },
    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
    },
    header: {
        height: 50,
        backgroundColor: '#242b38'
    },
    text: {
        textAlign: 'center',
        fontWeight: '100',
        color: '#fefefe',
    },
    dataWrapper: {
        marginTop: -1
    },
    row: {
        width: '30%',
        height: '15%',
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
