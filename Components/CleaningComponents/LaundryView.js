//Imports
import {StyleSheet, Text, View, Button, TextInput, Switch} from "react-native";
import React from "react";
import { FontAwesome5, Entypo } from '@expo/vector-icons';

//Her hardcodes tre status. Grundet manglende vertikal integration hardcodes

//Status 1 er en komponents, som skal fremvises, hvis en vask ikke er sat igang endnu
const Status1 =
    <View style={{alignItems: 'center', backgroundColor: 'white', width: '38%'}}>
        <Text>Ikke sat igang</Text>
        <FontAwesome5 name="smile" size={24} color='green'/>
    </View>

//Status 2 skal fremvises hvis en vask snart startes
const Status2 =
    <View style={{alignItems: 'center', backgroundColor: 'white', width: '38%'}}>
        <Text>Starter snart </Text>
        <FontAwesome5 name="surprise" size={24} color="yellow" />
    </View>

//Status 3 skal vises hvis en vask er gået igang
const Status3 =
    <View style={{alignItems: 'center', backgroundColor: 'white', width: '38%'}}>
        <Text>Er sat igang i dag</Text>
        <Entypo name="emoji-sad" size={24} color="red" />
    </View>

//Oprettelse af klasse til vaksetøjsplanlægning
export default class LandryView extends React.Component {

    //Vi Opretter en statearray med tre prædefinerede objekter, som skal printes i render
    state = ({
            switchItems: [{ date: '13:30', name: 'Sarah Hansen', status: Status1}, { date: '12:00', name: 'Hans Hansen', status: Status2}, { date: '09:00', name: 'Signe Emilie', status: Status3}   ] }
                )

    //I render printes en liste over planlæagte vaske. Listene printes for at eksemplificerer en af hver prædefinerede statusser
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

//Her oprettes sstyling komponenter for komponenter i render
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
