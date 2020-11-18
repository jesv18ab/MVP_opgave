import React, { Component } from 'react';
import {StyleSheet, Text,
    View,
    Alert,
    TouchableOpacity,
    Image,
    Linking,
    Modal,
    TouchableHighlight,
    TextInput,
    Button,
    ScrollView,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import HeaderEvents from "./HeaderEvents";
import TimePicker from "react-native-simple-time-picker";
import firebase from "firebase";
import {AntDesign} from "@expo/vector-icons";
import HeaderNav from "../HeaderNav";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { format } from "date-fns";


const title = "Opret Begivenhed"

//Kalender klassen er en eksternt hentet komponent, som ikek er blevet tilpasset til porjektet endnu
//Selve designet er under overvejelser, men er ikke fuldstændig fastlagt.
export default class CalendarView extends Component {

    //Der oprettes en constructor, der tager props med som argument
    //Derudocer sættes startværdier for state variablen.
    //Slutteligt oprettes der metoder til at håndtere skift i datovalg
    constructor(props) {
        super(props);
        this.state = {
            day: null,
            setEventModalVisible: false,
            setTimeVisible: false,
            selectedHours: 12,
            selectedMinutes:  30,
            chosenStartHours: "",
            chosenStartMinutes: "",
            chosenEndHours: "",
            chosenEndMinutes: "",
            showMode: 'time',
            time: 12,
            type: null,
            description: null,
            eventName: null,
            houseHoldId: null,
            allHouseHoldEvents: ["Der er ingen begivnheder lige nu"],
            showCalendar: false,
            dates: []
        };
        this.onDateChange = this.onDateChange.bind(this);
    }
    componentDidMount() {
        this.getHouseHoldId()
    }

    getHouseHoldId = () => {
        let houseHoldId = null;
        const allUsers = Object.values(this.props.screenProps.allUsers);
        allUsers.map((item, index) => {
            if(item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                houseHoldId = item.houseHoldId
            }
        });
        firebase.database().ref(`/households/${houseHoldId}/events/`).on('value', snapshot => {
                let arr = [];
                console.log(snapshot.val())
                Object.values(Object.values(Object.values(snapshot.val()))).map((item, index) => {
                    arr.push(Object.values(Object.values(item)[0])[0])
                });
                arr =  arr.reduce((c, v) => Object.assign(c, {[v]: {selected: true, endingDay: true, color: 'green', textColor: 'gray'}}), {});
                this.setState({dates: arr});
                this.setState({allHouseHoldEvents: snapshot.val()});
                this.setState({houseHoldId: houseHoldId })
            }
        );

    };
    //Alert som kan anvendes, hvis man vælger en dato
    //Er ikke brugt
    makeEvent =() =>{
        if (this.state.setEventModalVisible === false){
            this.setState({setEventModalVisible: true})
        } else if(this.state.setEventModalVisible === true) {
            this.setState({setEventModalVisible: false})
        }
    };
    //Metoder som håndtere skiftende datoer
    onDateChange(date) {
        let date_string = date.toString();
        let dateArray = [];
        let output = date_string.split('');
        output.map((item, index) => {
            if (index < 10 ){
                dateArray.push(item);
            }
        });
        let date_formatted = dateArray.join("");
        this.setState({
        });
    }
    calendar = () => {
        console.log("Dette er branch specifik");
        var testVariabel = "SDFSDFSDF";
        try {
            Linking.openURL('https://calendar.google.com/calendar/u/0/r')
        } catch (e) {
            console.log(e.message);
        }
    };

    newEvent = ({day}) => {
        this.setState({day: day})
            Alert.alert(
            'Vil du oprette en ny begivenhed?',
            '',
            [
                {text: 'Cancel'},
                {text: 'Opret', onPress: () => this.setState({setEventModalVisible: true })},
            ],
            { cancelable: false }
        )

    };

    showTime = type =>{
        this.setState({type: type})
        // this.setState({setEventModalVisible: false})
        if (this.state.setTimeVisible === false){
            this.setState({setTimeVisible: true})
        } else if(this.state.setTimeVisible === true) {
            this.setState({setTimeVisible: false})
        }
    };




    setTimeStartTime = () => {
        if (this.state.type === 1){
        }
        let minutesBelow = 0;
        let hoursBelow = 0;
        if (this.state.selectedHours < 10){
            hoursBelow = hoursBelow.toString()+this.state.selectedHours.toString()+":";
            this.setState({chosenStartHours: hoursBelow})
        }
        else {
            this.setState({chosenStartHours: this.state.selectedHours + ":"})
        }
        if (this.state.selectedMinutes < 10){
            minutesBelow = minutesBelow.toString()+this.state.selectedMinutes.toString()
            this.setState({chosenStartMinutes: minutesBelow})
        }
        else {
            this.setState({chosenStartMinutes: this.state.selectedMinutes})
        }
        this.setState({selectedHours: 12 });
        this.setState({selectedMinutes: 30 });
        this.setState({setTimeVisible: false})
    };

    setTime = () => {
        if (this.state.type === 1){
            this.setTimeStartTime()
        }
        else if (this.state.type === 2) {
            this.setTimeEndTime()
        }else {
            Alert.alert("Type er ikke sat")
        }
    };

    reset = () => {
        this.setState({time: 12, selectedHours: 12, selectedMinutes: 30, chosenStartHours: "", chosenStartMinutes: "", chosenEndHours: "", chosenEndMinutes: "", type: null, description: null, eventName: null, setTimeVisible: false, setEventModalVisible: false, })
    };

    setTimeEndTime = () => {
        let minutesBelow = 0;
        let hoursBelow = 0;
        if (this.state.selectedHours < 10){
            hoursBelow = hoursBelow.toString()+this.state.selectedHours.toString()+":";
            this.setState({chosenEndHours: hoursBelow})
        }
        else {
            this.setState({chosenEndHours: this.state.selectedHours + ":"})
        }
        if (this.state.selectedMinutes < 10){
            minutesBelow = minutesBelow.toString()+this.state.selectedMinutes.toString()
            this.setState({chosenEndMinutes: minutesBelow})
        }
        else {
            this.setState({chosenEndMinutes: this.state.selectedMinutes})
        }
        this.setState({selectedHours: 12 });
        this.setState({selectedMinutes: 30 });
        this.setState({setTimeVisible: false})
    };

    createEvent = () => {
        let startTime = this.state.chosenStartHours + this.state.chosenStartMinutes;
        let endTime = this.state.chosenEndHours + this.state.chosenEndMinutes;
        const { eventName, description, houseHoldId, day } = this.state;
        let event = {
            date: day.dateString,
            eventName: eventName,
            startTime: startTime,
            endTime: endTime,
            description: description,
        };
        firebase.database().ref(`/households/${houseHoldId}/events/`).push({event});
        this.reset()
    };

    //I render instantieres en CalenderPicker komponent, der fremviser en kalender
    //Kalender har en property, som kan registrere valg af datoer, som forekommer ved tryk på skærmen
    render() {
        const { selectedHours, selectedMinutes, chosenStartHours, chosenStartMinutes, chosenEndHours, chosenEndMinutes, houseHoldId, showCalendar, day    } = this.state;
        const {  setEventModalVisible, setTimeVisible, description, eventName, dates } = this.state;
        let dayFormatted = null;
      if (day){
          let newdate = new Date(day.dateString);
           dayFormatted = format(newdate, "dd MMMM yyyy ")
      }
      console.log(day)
        const allEvents = (Object.values(Object.values(Object.values(this.state.allHouseHoldEvents))));
        const eventKeys = Object.keys(this.state.allHouseHoldEvents);
        return (
            <View style={{flex: 1}}>
                <View >
                    <View style={{marginTop: '3%', width: '100%', height: '5%'}} >
                        <HeaderNav title="Kalender" />
                    </View>
                    <Text style={{zIndex: 10, marginLeft: 140, marginTop: 15, position: 'absolute', fontSize: 20}}>November</Text>
                   <View style={{padding: '5%', height: '65%', paddingBottom: '1%'}}>
                    <Calendar
                        current={Date()}
                        onDayLongPress={(day) => {this.newEvent({day})}}
                        markedDates={dates}
                        monthFormat={'MM'}
                        enableSwipeMonths={true}
                        onMonthChange={(month) => {console.log('month changed', month)}}
                        hideArrows={false}
                        hideExtraDays={true}
                        disableMonthChange={true}
                        firstDay={1}
                        hideDayNames={false}
                        onDateChange={(day) => {this.setState({day})}}
                        showWeekNumbers={true}
                        onPressArrowLeft={substractMonth => substractMonth()}
                        onPressArrowRight={addMonth => addMonth()}
                    />
                </View>
                </View>
                <View>
                <View style={{ bottom: '30%'}}>
                <Text style={{fontWeight: 'bold', fontSize: 32, }}> Kommende begivenheder </Text>
                </View>
                <ScrollView horizontal={true} style={{width:'100%', height: '30%', bottom: '15%'}}>
                    {allEvents.map((item, index)=>(
                        <View style={{width:'40%', height: '100%', padding: '1%', justifyContent: 'center', alignItems: 'center'}} key={index}>
                           <View style={{borderWidth: 1, borderColor: 'black', width: '95%', height: '100%', backgroundColor: 'white'}} >
                           <View style={{backgroundColor: '#3D6DCC', justifyContent: 'center', alignItems: 'center', padding: '5%'}}>
                            <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{Object.values(Object.values(item)[0])[3]}</Text>
                           </View>
                               <View style={{padding: '5%', justifyContent: 'center', alignItems: 'center'}}>
                                   <Text style={{fontWeight: 'bold'}}> Dato og tidspunkt </Text>
                            <Text style={{fontSize: 15}}> {Object.values(Object.values(item)[0])[4]} til {Object.values(Object.values(item)[0])[2]} </Text>
                            <Text style={{fontSize: 15}}>  {Object.values(Object.values(item)[0])[0]}</Text>
                               </View>
                               <View style={{justifyContent: 'center', alignItems: 'center'}} >
                                   <Text style={{fontWeight: 'bold'}}> Beskrivelse</Text>
                                   <Text style={{fontSize: 15, }}> Dato: {Object.values(Object.values(item)[0])[1]}</Text>
                               </View>
                           </View>
                        </View>
                    ))}
                </ScrollView>
                </View>
                <View style={styles.container}>
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={setEventModalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}>

                        <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center'}} >

                            <View style={styles.eventBox}>
                                <View style={styles.eventHeader}>
                                    <Text style={{fontSize: 25, color: '#fff' }}>{title}</Text>
                                </View>
                                <TextInput
                                    placeholder="Vælg en dag"
                                    value={dayFormatted}
                                    editable={false}
                                    style={styles.inputField}/>

                                <TextInput
                                    placeholder="Begivenhedens navn"
                                    value={eventName}
                                    style={styles.inputField}
                                    onChangeText={(eventName) => this.setState({ eventName })}/>
                                <View style={{width: '100%'}}>
                                    <View style={{flexDirection: 'row', width: '100%'}} >
                                        <View style={{width: '50%'}} >
                                            <TextInput
                                                placeholder="Fra"
                                                value={chosenStartHours.toString() +chosenStartMinutes.toString() }
                                                style={[styles.inputField_time, {justifyContent: 'flex-start', marginLeft: '10%'}]}
                                                editable={false}
                                            />
                                        </View>
                                        <View style={{width: '50%'}}  >
                                            <TextInput
                                                placeholder="Til"
                                                value={chosenEndHours.toString() +chosenEndMinutes.toString() }
                                                style={[styles.inputField_time,]}
                                                editable={false}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', width: '100%'}} >
                                        <View style={{width: '50%'}} >
                                            <Button title={"Vælg start"} onPress={() =>this.showTime(1)} />
                                        </View>
                                        <View style={{width: '50%'}} >
                                            <Button title={"Vælg slut"} onPress={() =>this.showTime(2)} />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <TextInput
                                        placeholder="Beskrivelse af Begivenhed...."
                                        value={description}
                                        style={styles.description}
                                        onChangeText={(description) => this.setState({ description })}
                                    />
                                </View>
                                <View style={styles.modalView}>
                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                        onPress={this.makeEvent}>
                                        <Text style={styles.textStyle}>Hide Modal</Text>
                                    </TouchableHighlight>
                                    <Button title="Set false" onPress={this.makeEvent} />

                                </View>
                                {(setTimeVisible &&
                                    <View style={{backgroundColor: 'white', zIndex: 10, marginBottom: 180, position: 'absolute', width: '120%', height: '100%', marginRight: '35%'}}>
                                        <TimePicker
                                            selectedHours={selectedHours}
                                            selectedMinutes={selectedMinutes}
                                            onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
                                        />
                                        <Button title="færdig" onPress={this.setTime} />
                                    </View>
                                )}

                            </View>

                        </View>
                    </Modal>
                </View>
            </View>


        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconButtonsFacebook: {
        alignItems: 'center',
        borderColor:'#47525E',
        width: '70%',
        height: '70%',
        borderWidth:1,
        borderRadius: 5,
        bottom:65,
        padding:10,
        left:80,
        marginTop: 200
    },

    buttonText:{
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sigUpButton:{
        alignItems: 'center',
        width: 280,
        height: 54,
        padding: 10,
        borderRadius: 5,
        bottom:60,
    },
    inputField: {
        borderWidth: 1,
        margin: 10,
        padding: 10,
    },
    inputField_time: {
        borderWidth: 1,
        padding: 10,
        width: '85%'
    },
    eventBox: {
        height: '50%',
        width: '85%',
        backgroundColor: 'white',
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        elevation: 1,
    },
    description: {
        borderWidth: 1,
        padding: 10,
        width: '85%',
        height: '55%'
    },
    eventHeader: {
        width: '100%',
        padding: '3%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3D6DCC'
    },
    event: {
        width: '80%',
        padding: '3%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3D6DCC'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#47525E',
        width: 250,
        height: 54,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginTop:7,
    }
});

/*             <View>
    <TouchableOpacity style={[styles.iconButtonsFacebook,]} onPress={this.calendar}>
        <Text>Google kalender</Text>
        <Image source={require('./assetsCalendar/GoogleCalendar.png')} style={{ width: 38, height: 38 }}/>
    </TouchableOpacity>
            </View>*/
/*
*  <ScrollView horizontal={true} style={{width:'100%', height: '40%', borderWidth: 1, borderColor: 'black', backgroundColor: 'b' }}>
                    {allEvents.map((item, index)=>(
                        <View style={{marginTop: '20%', borderWidth: 1, borderColor: 'black', width:'10%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCDCDC'}} key={index}>
                            <Text style={{fontSize: 15}}>{Object.values(Object.values(item)[0])[3]}</Text>
                            <Text style={{fontSize: 15}}> fra {Object.values(Object.values(item)[0])[4]} til {Object.values(Object.values(item)[0])[2]} </Text>
                            <Text style={{fontSize: 15}}>{Object.values(Object.values(item)[0])[0]}</Text>
                        </View>
                    ))}
                </ScrollView>*/
/*  <View style={styles.container}>

            </View>
                <View style={{height: '100%', width: '100%', marginBottom: 100, zIndex: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}} >
                    <CalendarPicker
                        markedDates={'2020-12-10'}
                        selectedDayColor="#5FB8B2"
                        style={{marginTop: 500}} onDateChange={this.onDateChange} />
                </View>
                <View style={styles.container}>
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={setEventModalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                        }}>

                        <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center'}} >

                            <View style={styles.eventBox}>
                                <View style={styles.eventHeader}>
                                    <Text style={{fontSize: 25, color: '#fff' }}>{title}</Text>
                                </View>
                                <TextInput
                                    placeholder={startDate.toString()}
                                    value={startDate.toString()}
                                    editable={false}
                                    style={styles.inputField}/>
                                <Button title={"Vælg Dato"} onPress={this.showCalendar} />

                                <TextInput
                                    placeholder="Begivenhedens navn"
                                    value={eventName}
                                    style={styles.inputField}
                                    onChangeText={(eventName) => this.setState({ eventName })}/>
                                <View style={{width: '100%'}}>
                                    <View style={{flexDirection: 'row', width: '100%'}} >
                                        <View style={{width: '50%'}} >
                                            <TextInput
                                                placeholder="Fra"
                                                value={chosenStartHours.toString() +chosenStartMinutes.toString() }
                                                style={[styles.inputField_time, {justifyContent: 'flex-start', marginLeft: '10%'}]}
                                                editable={false}
                                            />
                                        </View>
                                        <View style={{width: '50%'}}  >
                                            <TextInput
                                                placeholder="Til"
                                                value={chosenEndHours.toString() +chosenEndMinutes.toString() }
                                                style={[styles.inputField_time,]}
                                                editable={false}
                                            />
                                        </View>
                                    </View>
                                    <View style={{flexDirection: 'row', width: '100%'}} >
                                        <View style={{width: '50%'}} >
                                            <Button title={"Vælg start"} onPress={() =>this.showTime(1)} />
                                        </View>
                                        <View style={{width: '50%'}} >
                                            <Button title={"Vælg slut"} onPress={() =>this.showTime(2)} />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <TextInput
                                        placeholder="Beskrivelse af Begivenhed...."
                                        value={description}
                                        style={styles.description}
                                        onChangeText={(description) => this.setState({ description })}
                                    />
                                </View>

                                <View style={styles.modalView}>
                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                        onPress={this.makeEvent}>
                                        <Text style={styles.textStyle}>Hide Modal</Text>
                                    </TouchableHighlight>
                                    <Button title="Set false" onPress={this.makeEvent} />
                                </View>
                                {(setTimeVisible &&
                                    <View style={{backgroundColor: 'white', zIndex: 10, marginBottom: 180, position: 'absolute', width: '120%', height: '100%', marginRight: '35%'}}>
                                        <TimePicker
                                            selectedHours={selectedHours}
                                            selectedMinutes={selectedMinutes}
                                            onChange={(hours, minutes) => this.setState({ selectedHours: hours, selectedMinutes: minutes })}
                                        />
                                        <Button title="færdig" onPress={this.setTime} />
                                    </View>
                                )}

                            </View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={this.createEvent}>
                                <Text style={styles.buttonText}>Opret begivenhed</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
                <View style={{width: '100%', height: 100, backgroundColor: 'white' }}>

                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.newEvent}>
                    <Text style={styles.buttonText}>Ny begivenhed</Text>
                </TouchableOpacity>
            </View>*/
