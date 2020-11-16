//Vi husker de nødvendige imports
import React from 'react';
import {Image, LogBox, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, DeviceEventEmitter} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default class HeaderNAvigation extends React.Component{
    returnToInitialPage = () => {
        this.props.navigation.navigate('InitialPage');
    };
    render() {
        console.log(this.props.navigation)
        return (
            <View style={{marginLeft: 20}}><TouchableOpacity  onPress={this.returnToInitialPage}>
                <AntDesign name="arrowleft" size={33} color="black" />
            </TouchableOpacity>
            </View>
        )
    }
}
