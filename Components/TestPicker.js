import React, { useState } from "react";
import { Button, View, TouchableOpacity, createElement, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

    export default class extends React.Component{
        state = {
            isDatePickerVisibleStart: false,
            isDatePickerVisibleEnd: false,
            textStart: "Start",
            textEnd: "Slut"
        };
         showDatePickerStart = () => {
           this.setState({isDatePickerVisibleStart: true})
        };
         hideDatePickerStart = () => {
             this.setState({isDatePickerVisibleStart: false})
        };
        showDatePickerEnd = () => {
            this.setState({isDatePickerVisibleEnd: true})
        };
        hideDatePickerEnd = () => {
            this.setState({isDatePickerVisibleEnd: false})
        };


         handleConfirmEnd = (time) => {
             let minutes = null;
             let hours = null;
             if (time.getMinutes() < 10 ){
                 minutes = "0"+time.getMinutes().toString()
             } else {
                 minutes = time.getMinutes().toString()
             }
             if (time.getHours() < 10 ){
                 hours = "0"+time.getHours().toString() + ":"
             } else {
                 hours = time.getHours().toString() + ":"
             }
             let endTime = hours + minutes;
             this.setState({textEnd: endTime });
             this.hideDatePickerEnd();
        };
        handleConfirmStart = (time) => {
            let minutes = null;
            let hours = null;
            if (time.getMinutes() < 10 ){
                minutes = "0"+time.getMinutes().toString()
            } else {
                minutes = time.getMinutes().toString()
            }
            if (time.getHours() < 10 ){
                hours = "0"+time.getHours().toString() + ":"
            } else {
                hours = time.getHours().toString() + ":"
            }
            let startTime = hours + minutes;
            this.setState({textStart: startTime });
            this.hideDatePickerStart();
        };
        render() {
        const {isDatePickerVisibleStart, isDatePickerVisibleEnd, textEnd, textStart } = this.state
        return (
        <View style={{ width: '100%', height: '10%', top: 100}} >
            <Button title="Show Date Picker" onPress={this.showDatePickerStart} />
            <DateTimePickerModal
                isVisible={isDatePickerVisibleStart}
                mode="time"
                onConfirm={this.handleConfirmStart}
                onCancel={this.hideDatePickerStart}
            />
            <DateTimePickerModal
                isVisible={isDatePickerVisibleEnd}
                mode="time"
                onConfirm={this.handleConfirmEnd}
                onCancel={this.hideDatePickerEnd}
            />
            <View  style={{ flexDirection: 'row', width: "100%", height: '100%',  alignItems: 'center',  top: 20  }}>
            <TouchableOpacity onPress={this.showDatePickerStart} style={{ width: "20%", height: '100%', marginLeft: '20%', borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                <Text>{textStart}</Text>
            </TouchableOpacity>
                <TouchableOpacity onPress={this.showDatePickerEnd} style={{ width: "20%", height: '100%', marginLeft: '20%', borderWidth: 1, borderColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                <Text >{textEnd}</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
        }

    };

