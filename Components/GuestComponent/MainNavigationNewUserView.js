import React, { Component } from 'react';
import { Button, View, StyleSheet } from 'react-native';



export default class InitalViewNewUsers extends Component {


    getHouseHolds = () =>{

    }

    gotToCreate = () => {
        this.props.navigation.navigate('CreateHouseHold');
    };
    gotToInvitations = () => {
        this.props.navigation.navigate('MyInvites');
    };
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button title="Tryk her for at oprette et kollektiv" onPress={this.gotToCreate}/>
                </View>
                <View style={styles.buttonContainer}>
                    <Button title="TRyk her for at se dine invitationer" onPress={this.gotToInvitations}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',

        justifyContent: 'center',
    },
    buttonContainer: {
        flex: 1,
    }
});
