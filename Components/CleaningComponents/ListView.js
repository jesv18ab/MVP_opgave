
import * as React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import firebase from 'firebase';
import HeaderClass from "./HeaderClass";

//Nedenstående klasse skal på sigt anvendes, men er på nuværende tidspunkt
//Blot en replikationen af carDetials klassen fra Øvelse 6
export default class ListClass extends React.Component {
    //Instantiering af state variabler
    state = { list: null };

    //Der anvendes ComponentDidMount for relevante metoder.
    componentDidMount() {
        // Vi udlæser ID fra navgation parametre og loader bilen når komponenten starter
        const id = this.props.navigation.getParam('id');
        this.loadList(id);
    }

    //Denne metode skal loade en liste pba. et ID
    loadList = id => {
        firebase
            .database().ref(`/groceryLists/${id}`).on('value', snapshot => {
            this.setState({ list: snapshot.val() });
        });
    };

//Der oprettes et if-else statement, som skal bruges til at teste,
    //Om der er en liste, som passer med det id, som er parset med props
    //Findes der en liste, printes der data ud fra listen.
    render() {
        const { list } = this.state;
        if (!list) {
            return (
                <View>
                <HeaderClass navigation={this.props.navigation} title='Common Areas'/>
                <Text>No data</Text>
                </View>
                    )
        }
        return (
            <View>
            <HeaderClass navigation={this.props.navigation} title='Common Areas'/>
            <View style={styles.container}>
                <Button title="Edit"/>
                <Button title="Delete"/>
                <View style={styles.row}>
                    <Text style={styles.label}></Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}></Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}></Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}> </Text>
                </View>
            </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start' },
    row: {
        margin: 5,
        padding: 5,
        flexDirection: 'row',
    },
    label: { width: 100, fontWeight: 'bold' },
    value: { flex: 1 },
});
