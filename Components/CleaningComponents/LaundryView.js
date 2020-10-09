import {StyleSheet, Text, View} from "react-native";
import React from "react";
import Header from "./Header";

export default class LandryView extends React.Component {
render(){
    return(
        <View>
            <Header navigation={this.props.navigation} title='Laundry'/>
            <Text>Laundry View</Text>
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
