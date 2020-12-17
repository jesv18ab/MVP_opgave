import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Switch, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard} from 'react-native';
import Modal from 'react-native-modal'; // 2.4.0
import DateTimePickerModal from "react-native-modal-datetime-picker";

//Der er ikke brugt tid på funktionalitet eller design af denne klasse
//Klassen vil blive lavet på et senere tidspunkt.


export default class HouseCleaning extends React.Component {
    state = (
        {
            switchItems: [ {isEnabled: true, date: 'Udført: 20-10-2020', name: 'Sarah Hansen' }, {isEnabled: false, date: '20-10-2020', name: 'Søren Andersen' }, {isEnabled: false, date: '20-10-2020', name: 'Mads Klausen'},
                {isEnabled: false, date: '20-10-2020', name: 'Lone Hansen' },
             ],
            visibleModal: null,
            isDatePickerVisible: false,
            date: '',
            name: null
        }
    );

    setSwitch = (status, index) => {
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        let currentDate ="Udført: " + date + "-"+ month + "-" + year
        let currentDate2 ="Opdateret: " + date + "-"+ month + "-" + year
        let arr = this.state.switchItems;
        if (status){
            arr[index].isEnabled = false;
            arr[index].date = currentDate2;
            this.setState({switchItems: arr})
        }else{
            arr[index].isEnabled = true;
            console.log(arr[index].date);
            arr[index].date = currentDate;
            this.setState({switchItems: arr})}
    };


    handleConfirm = (date) => {
        let newDate = new Date(date);
        let month = newDate.getMonth()+1;
        let day = null;
        if (newDate.getDay() < 10)
        {
            day = "0"+newDate.getDay()
        }
        else {
            day = newDate.getDay()
        }
        if (month < 10)
        {
            month = "0"+month
        }
        newDate = day + "-" + month + "-" + newDate.getFullYear();
        this.setState({date: newDate})
        this.hideDatePicker();
    };

    showDatePicker = () => {
        this.setState({isDatePickerVisible: true})
    };
    hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
    };

    createCleaning = () => {
       let arr = [];
       arr = this.state.switchItems;
       let item= {isEnabled: false, date: "Planlagt: " +  this.state.date, name: this.state.name}
       arr.push(item);
        this.setState({switchItems: arr, visibleModal: null })
        this.setState({visibleModal: null})
    };


    render(){
        const {isDatePickerVisible, date} = this.state
        return(
            <View style={styles.container}>
                <Text style={styles.headerText}>Crazy cleaning !</Text>
                <Modal isVisible={this.state.visibleModal === 1}>
                    <View style={styles.modalContent}>
                        <Text style={styles.headerText2}>Planlæg rengøring!!</Text>
                        <Text style={styles.text3}>Navn</Text>
                        <TextInput
                            placeholder={"Skriv navn her........."}
                            style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%' }}
                            onChangeText={(name) => this.setState({ name })}
                        />
                        <TouchableOpacity style={styles.button2} onPress={this.showDatePicker} >
                            <View>
                                <Text>Vælg dato</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row'}} >
                            <TouchableOpacity style={styles.button3} onPress={() => this.setState({ visibleModal: null}) }>
                                <View>
                                    <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>Annuller</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.createCleaning} style={styles.button3} >
                                <View>
                                    <Text style={{color: 'white', fontSize: 15, fontWeight: 'bold'}}>Opret</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                        />
                        <Text style={{ width: '60%', height: '5%', alignSelf: 'center', textAlign: 'center', fontSize: 15, fontWeight: 'bold', bottom: 90}} >{date}</Text>
                </Modal>
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
                    <View style={{  height: '50%', bottom: 190 }}>
                            {this.state.switchItems.map((item, index) => (
                                <View style={{ flexDirection: 'row', width: "90%",  alignItems: 'center'  }}>
                                    <TextInput value={item.name} style={item.isEnabled ? styles.jobDoneStyleInPut1 : styles.jobWaitingStyleInPut1}  />
                                    <TextInput value={item.date} style={item.isEnabled ? styles.jobDoneStyleInPut2 : styles.jobWaitingStyleInPut2} />
                                    <Switch
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={item.isEnabled ? '#f5dd4b' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => this.setSwitch(item.isEnabled, index)}
                                    value={item.isEnabled}
                                />
                                </View>
                            ))}
                        <TouchableOpacity style={{marginTop: '10%'}} onPress={() => this.setState({ visibleModal: 1} )}>
                            <View style={styles.button}>
                                <Text>Planlæg her</Text>
                            </View>
                        </TouchableOpacity>
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
    headerText2: {
        fontSize: 35,
        fontWeight:'bold',
        color:'#5FB8B2',
    },
    text3: {
        fontSize: 20,
        fontWeight:'bold',
        color:'#5FB8B2',
        right: 110
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
    },
    jobDoneStyleInPut1: {
        backgroundColor: '#2FBD9F',
        width: '33%',
        height: 42,
        right:36,
        textAlign: 'center',
        top: 2,
    },
    jobDoneStyleInPut2: {
        backgroundColor: '#2FBD9F',
        width: '40%',
        height: 42,
        marginBottom: 5,
        textAlign: 'center',
        right: 36,
        top: 4.5
    },
    jobWaitingStyleInPut1: {
        backgroundColor: '#fcffa4',
        width: '33%',
        height: 42,
        right:36,
        textAlign: 'center',
        top: 2,

    },
    jobWaitingStyleInPut2: {
        backgroundColor: '#fcffa4',
        width: '40%',
        height: 42,
        marginBottom: 5,
        textAlign: 'center',
        right: 36,
        top: 4.5
    },
    button: {
        backgroundColor: 'lightblue',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    button2: {
        backgroundColor: 'lightblue',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        width: '50%',
        alignSelf: 'center',
        marginTop: '5%'
    },
    button3: {
        backgroundColor: '#47525E',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        width: '45%',
        marginLeft: '3%',
        alignSelf: 'center',
        marginTop: '15%'
    },
    modalContent: {
        bottom: '50%',
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        height: '40%',
        position: 'absolute',
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },

});
