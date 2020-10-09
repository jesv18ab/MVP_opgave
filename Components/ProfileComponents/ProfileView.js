import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class ProfileView extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Profile View</Text>
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
