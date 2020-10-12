import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Header} from "react-native-elements";

export default class HeaderNavClass extends React.Component{
    // Klassen skal fungere som en konstant header i de fleste  klasser i bottomnavigatoren
    //Denne header faciliteres af import fra react-native-elements
    render(){
        return(
            <View style={styles.container}>
                <Header statusBarProps={{ barStyle: 'light-content' }}
                        centerComponent={ { text: this.props.title, style: { color: '#fff', fontSize: 25 }  }}
                        containerStyle={{
                            backgroundColor: '#3D6DCC',
                            justifyContent: 'space-around',}}/>
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
    txt:{
        width: '100%',
        textAlign:'center',
        fontSize:15,
        paddingRight:66
    }
});
