import {StyleSheet, Text, View} from "react-native";
import React from "react";
import WeShareView from "../EconomyComponents/WeShareView";

//Dette vire er udelukkende opretet for at vise vores weShareView
export default class EconomyView extends React.Component {

    //I render kaldes weShare View
    render(){
        return(
          <WeShareView/>
        )
    }

}
//Stlyings er ikke anvendt
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
