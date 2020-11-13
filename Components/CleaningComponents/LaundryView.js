import {StyleSheet, Text, View, Button} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";
import AsyncStorage from '@react-native-community/async-storage';

//Der er ikke brugt tid på funktionalitet eller design af denne klasse
//Klassen vil blive lavet på et senere tidspunkt.
export default class LandryView extends React.Component {

    tab =()=>{
        this.props.navigation.navigate('Weshare');
    }

    render(){
    return(
        <View>
            <HeaderClass navigation={this.props.navigation} title='Laundry'/>
            <Text>Laundry View</Text>
            <Button title="Tab" onPress={this.tab}/>
        </View>
    )
}

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
