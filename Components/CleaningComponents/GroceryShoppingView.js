import {StyleSheet, Text, View} from "react-native";
import React from "react";
import Header from "./Header";

export default class GroceryShoppingView extends React.Component {
    render(){
        return(
            <View>
                <Header navigation={this.props.navigation} title='Grocery'/>
                <Text>Grocery View</Text>
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
