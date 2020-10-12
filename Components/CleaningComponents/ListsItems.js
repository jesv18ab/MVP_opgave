
import * as React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity,} from 'react-native';



export default class ListItems extends React.Component {
    //Instantiering af state variabel.
    state = ({
        items: []
    });

    //MEtoden er ikke klar til brug endnu
    /*handlePress = () => {
        // Her pakker vi ting ud fra props
        const {id, onSelect} = this.props;
        // Kalder den onSelect prop vi får, med det ID vi har fået som argument.
        onSelect(id)
    };*/

    //I render oprettes en komponent, som er mulig at trykke på.
    //I denne printes der en mail ud, som er parset via props.
    render() {
        return (
            <TouchableOpacity style={styles.container} /*onPress={this.handlePress}*/>
                <Text style={styles.label} >
                    {this.props.mail}
                </Text>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
        margin: 5,
        padding: 5,
        height: 50,
        justifyContent:'center'
    },
    label: { fontWeight: 'bold' },
});
