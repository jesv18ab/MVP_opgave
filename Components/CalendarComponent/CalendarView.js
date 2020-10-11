import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import HeaderNav from "../HeaderNav";

export default class CalendarView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    makeAlert =() =>{
        Alert.alert("ramt");
    }

    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });
     
    }
    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <View style={{marginTop: 30}} >
                <HeaderNav title="Kalender" />
                <View style={{marginTop: 40}}>
                <CalendarPicker style={{marginTop: 500}} onDateChange={this.onDateChange}/>
                </View>
                <View>
                    <Text>SELECTED DATE:{ startDate }</Text>
                </View>
            </View>
        );
    }
}


