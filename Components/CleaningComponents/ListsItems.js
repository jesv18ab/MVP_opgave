
import * as React from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity,} from 'react-native';



export default class ListsItems extends React.Component {
    //Oprettelse af boolean, der skal kontroller life cycle
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //Instantiering af state variabel.
    state = ({
        items: []
    });

    handlePress = () => {
        // Her pakker vi ting ud fra props
        const {id, onSelect} = this.props;
        // Kalder den onSelect prop vi får, med det ID vi har fået som argument.
        onSelect(id)
    };

    //I render oprettes en komponent, som er mulig at trykke på.
    //I denne printes der en mail ud, som er parset via props.
    render() {
       // console.log("Dette er list")
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
       // console.log("Få fa på keys")
        return (
            <View style={styles.listContainer} >
                <Text style={styles.label}>{this.props.list.email}</Text>
            <TouchableOpacity style={styles.button} onPress={this.handlePress}>
                <Text style={{color: '#FFF', textAlign: 'center'}}>Gå til</Text>
            </TouchableOpacity>
            </View>
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
    label: {
        fontWeight: 'bold',
        marginLeft: '25%'
    },
    listContainer: {
        height: 40,
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.3,
        margin: '2%',
        marginLeft: '15%',
    },
    button: {
        padding: 10,
        backgroundColor: '#414a4c',
        width: '30%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        marginLeft: '25%'
    },
});
