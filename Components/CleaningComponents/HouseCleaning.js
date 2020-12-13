import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Switch, ScrollView, TouchableOpacity} from 'react-native';

//Der er ikke brugt tid på funktionalitet eller design af denne klasse
//Klassen vil blive lavet på et senere tidspunkt.


export default class HouseCleaning extends React.Component {
    state = (
        {
            switchItems: [ {isEnabled: false, date: '20-10-2020', name: 'Sarah Hansen' }, {isEnabled: false, date: '20-10-2020', name: 'Søren Andersen' }, {isEnabled: false, date: '20-10-2020', name: 'Mads Klausen'},
                {isEnabled: false, date: '20-10-2020', name: 'Lone Hansen' },
             ],
        }
    );

    setSwitch = (status, index) => {
        let arr = this.state.switchItems;
        if (status){
            arr[index].isEnabled = false;
            this.setState({switchItems: arr})
        }else{
            arr[index].isEnabled = true;
            this.setState({switchItems: arr})}
    };


    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.headerText}>Crazy cleaning !</Text>
                <View style={{ flex: 1, flexDirection: 'row', top: '5%'}}>
                    <View style={styles.row} >
                        <Text>Person</Text>
                    </View>
                    <View style={styles.row} >
                        <Text>Dato</Text>
                    </View>
                    <View style={styles.row}>
                        <Text> Fuldført</Text>
                    </View>
                </View>
                    <View style={{ bottom: '31%', height: '50%' }}>
                            {this.state.switchItems.map((item, index) => (
                                <View style={{ flexDirection: 'row', width: "90%",  alignItems: 'center'  }}>
                                    <TextInput value={item.name} style={{backgroundColor: 'white', width: '33%', height: 40, right:36, textAlign: 'center'   }}  />
                                    <TextInput value={item.date} style={{backgroundColor: 'white', width: '33%', height: 40, marginBottom: 5, textAlign: 'center', right: 36, top: 2   }} />
                                    <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={item.isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => this.setSwitch(item.isEnabled, index)}
                                    value={item.isEnabled}
                                />
                                </View>
                            ))}
                    </View>

            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
        width: '100%',
        height: '100%'
    },
    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
    },
    header: {
        height: 50,
        backgroundColor: '#242b38'
    },
    text: {
        textAlign: 'center',
        fontWeight: '100',
        color: '#fefefe',
    },
    dataWrapper: {
        marginTop: -1
    },
    row: {
        width: '30%',
        height: '15%',
        borderColor: 'black',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
