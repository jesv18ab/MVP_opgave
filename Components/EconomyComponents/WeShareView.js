import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import HeaderNav from "../HeaderNav";

export default class WeShareView extends React.Component{
    //I denne klasse er det meningen at der skal være en konfiguration til weShare
    //Derfor er der blot hentet et billede, som indgår i Image-komponentet.
    render(){
        return(
            <View style={styles.container}>
          <HeaderNav title="WeShare" />
                    <Image style={{height: '90%', width: '90%', marginTop: 10}} source={require('./EconomyAssets/Weshare.jpg')}/>
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
