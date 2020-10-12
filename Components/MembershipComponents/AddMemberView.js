import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class AddMemberView extends React.Component{
    //Ingen tid på design eller funktionaltet er anvendt i denne klasse.
    render(){
        return(
            <View style={styles.container}>
                <Text>AddMember View</Text>
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
