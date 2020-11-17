import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Header} from "react-native-elements";

export default class HeaderEvents extends React.Component{
    // Klassen skal fungere som en konstant header i de fleste  klasser i bottomnavigatoren
    //Denne header faciliteres af import fra react-native-elements
    render(){
        return(
                <Header
                    statusBarProps={{ barStyle: 'light-content' }}
                    centerComponent={ { text: "Opret Begivenhed", style: { color: '#fff',  }  }}
                    containerStyle={{backgroundColor: '#3D6DCC',}}/>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
});
