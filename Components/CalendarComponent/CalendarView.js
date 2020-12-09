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
    FlatList
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import HeaderEvents from "./HeaderEvents";
import TimePicker from "react-native-simple-time-picker";
import firebase from "firebase";
import {AntDesign} from "@expo/vector-icons";
import HeaderNav from "../HeaderNav";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { format } from "date-fns";
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
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
            description: "Beskrivelse af Begivenhed....",
            eventName: "Angiv begivenhedens navn",
            houseHoldId: null,
            allHouseHoldEvents: ["Der er ingen begivnheder lige nu"],
            showCalendar: false,
            dates: [],
            startTime: "Fra",
            endTime: 'Til',
            date: null
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
        console.log(houseHoldId);
        firebase.database().ref(`/households/${houseHoldId}/events/`).on('value', snapshot => {
            if (snapshot.val()){
                let arr = [];
                console.log(snapshot.val())
                Object.values(Object.values(Object.values(snapshot.val()))).map((item, index) => {
                    arr.push(Object.values(Object.values(item)[0])[0])
                });
                arr =  arr.reduce((c, v) => Object.assign(c, {[v]: {selected: true, endingDay: true, color: 'green', textColor: 'gray'}}), {});
                this.setState({dates: arr});
                this.setState({allHouseHoldEvents: snapshot.val()});
            }
            }
        );
        this.setState({houseHoldId: houseHoldId })

    };
    //Alert som kan anvendes, hvis man vælger en dato
    //Er ikke brugt
    makeEvent =() =>{
        this.reset();
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
        this.setState({day: day});
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
        this.setState({day: null, time: 12, selectedHours: 12, selectedMinutes: 30, chosenStartHours: "", chosenStartMinutes: "", chosenEndHours: "", chosenEndMinutes: "", type: null, description: "Beskrivelse af Begivenhed....", eventName: "Angiv begivenhedens navn", setTimeVisible: false, setEventModalVisible: false, startTime: "Fra", endTime: 'Til', date: null
        })
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
    showEvent = item => {
        const date =  Object.values(Object.values(Object.values(item)[0])[0])[0];
        const description =  Object.values(Object.values(Object.values(item)[0])[0])[1];
        const endTime =   Object.values(Object.values(Object.values(item)[0])[0])[2];
        const eventName =   Object.values(Object.values(Object.values(item)[0])[0])[3];
        const startTime =   Object.values(Object.values(Object.values(item)[0])[0])[4];
        let newdate = new Date(date);
        let dayFormatted = format(newdate, "dd MMMM yyyy ")
        this.setState({endTime: endTime, date: dayFormatted, description: description, eventName: eventName, startTime: startTime, setEventModalVisible: true })
    }

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

    test = () => {
        Alert.alert("TEst");
    };

    //I render instantieres en CalenderPicker komponent, der fremviser en kalender
    //Kalender har en property, som kan registrere valg af datoer, som forekommer ved tryk på skærmen
    render() {
        const { selectedHours, selectedMinutes, chosenStartHours, chosenStartMinutes, chosenEndHours, chosenEndMinutes, houseHoldId, showCalendar, day, startTime, endTime, date } = this.state;
        const {  setEventModalVisible, setTimeVisible, description, eventName, dates } = this.state;
        let dayFormatted = null;
      if (day){
          console.log("day")
          console.log(day);
          let newdate = new Date(day.dateString);
          console.log(newdate)
           dayFormatted = format(newdate, "dd MMMM yyyy ")
      }
      else if (date){
          dayFormatted = date
      }
        const allEvents = (Object.values(Object.values(Object.values(this.state.allHouseHoldEvents))));
        const eventKeys = Object.keys(this.state.allHouseHoldEvents);
        if (allEvents[0] === 'Der er ingen begivnheder lige nu'){
            return (
                <View style={{flex: 1, backgroundColor: 'white' }}>
                    <View>
                        <View style={{marginTop: '3%', width: '100%', height: '5%'}} >
                            <HeaderNav title="Kalender" />
                        </View>

                        <Text style={{zIndex: 10, marginLeft: '40%', marginTop: '15%', position: 'absolute', fontSize: 20}}></Text>
                        <View style={{ height: '65%', paddingBottom: '1%', marginTop:'3%', backgroundColor: 'white'}}>
                            <Calendar
                                current={Date()}
                                onDayLongPress={(day) => {this.newEvent({day})}}
                                markedDates={dates}
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
                        <Text>
                            Der er ingen begivenheder på nuværende tidspunkt
                        </Text>
                    </View>

                    <View style={styles.container}>
                        <Modal
                            transparent={true}
                            animationType="slide"
                            visible={setEventModalVisible}
                            onRequestClose={() => {
                                Alert.alert("Modal has been closed.");
                            }}>
                            <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center',}} >
                                <View style={styles.eventBox}>
                                    <View style={styles.eventHeader}>
                                        <Text style={{fontSize: 25, color: '#fff' }}>{title}</Text>
                                    </View>
                                    <View style={{padding: '2%', justifyContent: 'center', alignItems: 'center'}} >
                                        <Text style={{fontSize: 20, paddingBottom: '2%', fontWeight: 'bold'}}> Navn på begivenheden</Text>
                                        <TextInput
                                            placeholder={eventName}
                                            value={eventName}
                                            style={styles.inputField}
                                            onChangeText={(eventName) => this.setState({ eventName })}/>
                                    </View>
                                    <View style={{paddingTop: '2%', paddingRight: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <SimpleLineIcons style={{paddingRight: '3%', paddingBottom: '2%'}} name="clock" size={28} color="black" />
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}> Tidspunkt for begivenheden </Text>
                                    </View>
                                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: '2%'}}>
                                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }} >
                                            <View style={{width: '30%', }}  >
                                                <TextInput
                                                    placeholder={startTime}
                                                    value={chosenStartHours.toString() +chosenStartMinutes.toString() }
                                                    style={[styles.inputField_time, {justifyContent: 'flex-start', marginLeft: '10%'}]}
                                                    editable={true}
                                                    onFocus={() =>this.showTime(1)}
                                                />

                                            </View>
                                            <View style ={{justifyContent: 'center', alignItems: 'center'}}>
                                                <Text>  -   </Text>
                                            </View>
                                            <View style={{width: '30%'}}  >
                                                <TextInput
                                                    placeholder={endTime}
                                                    value={chosenEndHours.toString() + chosenEndMinutes.toString() }
                                                    style={[styles.inputField_time, {justifyContent: 'flex-end'}]}
                                                    onFocus={() =>this.showTime(2)}/>
                                            </View>
                                        </View>
                                        <View style={{paddingTop: '3%', paddingRight: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                            <MaterialCommunityIcons style={{paddingRight: '4%', paddingBottom: '2%'}} name="calendar-check-outline" size={30} color="black" />
                                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Dato begivenheden</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: 15, width: '100%' , }} > {dayFormatted} </Text>
                                        </View>
                                    </View>
                                    <View style={{paddingTop: '2%', paddingRight: '3%', paddingBottom: '2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}> Beskrivelse af begivenhed </Text>
                                    </View>
                                    <TextInput
                                        placeholder={description}
                                        value={description}
                                        style={styles.description}
                                        onChangeText={(description) => this.setState({ description })}
                                    />
                                    <View style={{ paddingTop: '8%'}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={this.makeEvent}>
                                                <Text style={styles.buttonText}>Annuller</Text>
                                            </TouchableOpacity>
                                            <Text>   </Text>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={this.createEvent}>
                                                <Text style={styles.buttonText}>Opret</Text>
                                            </TouchableOpacity>
                                        </View>
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

        } else{
            return(
                <View style={{flex: 1, backgroundColor: 'white' }}>
                    <View >
                        <View style={{marginTop: '3%', width: '100%', height: '5%'}} >
                            <HeaderNav title="Kalender" />
                        </View>
                        <Text style={{zIndex: 10, marginLeft: '40%', marginTop: '15%', position: 'absolute', fontSize: 20}}></Text>
                        <View style={{ height: '65%', paddingBottom: '1%', marginTop:'3%', backgroundColor: 'white'}}>
                            <Calendar
                                current={Date()}
                                onDayLongPress={(day) => {this.newEvent({day})}}
                                markedDates={dates}
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
                    <View style={{backgroundColor: 'white'}}>
                        <View style={{ bottom: '40%', marginLeft: '7%'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 28, color: '#5FB8B2' }}> Kommende begivenheder </Text>
                        </View>
                        <ScrollView  horizontal={true}  style={{width:'100%', height: '30%', bottom: '20%', backgroundColor: 'white'}}>
                            {allEvents.map((item, index)=>(
                                <TouchableOpacity onPress={() => this.showEvent ({item})} style={{width: 190, height: '100%'}}>
                                    <View style={{ padding: '0%', justifyContent: 'center', alignItems: 'center'}} key={index}>
                                        <View style={{borderWidth: 1, borderColor: 'black', width: '95%', height: '100%', backgroundColor: 'white'}} >
                                            <View style={{backgroundColor: '#5FB8B2', justifyContent: 'center', alignItems: 'center', padding: '5%'}}>
                                                <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>{Object.values(Object.values(item)[0])[3]}</Text>
                                            </View>
                                            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: '5%'}}>
                                                <Text style={{fontWeight: 'bold'}}> Dato og tid </Text>
                                            </View>
                                            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: '5%'}}>
                                                <Text style={{fontSize: 15}}> {Object.values(Object.values(item)[0])[4]} til {Object.values(Object.values(item)[0])[2]} </Text>
                                                <Text style={{fontSize: 15, paddingTop: '2%'}}>  {Object.values(Object.values(item)[0])[0]}</Text>
                                            </View>
                                            <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: '5%'}} >
                                                <Text style={{fontWeight: 'bold'}}> Beskrivelse</Text>
                                            </View>
                                            <View style={{padding: '1%', justifyContent: 'center', alignItems: 'center'}}>
                                                <Text style={{fontSize: 15, }}>{Object.values(Object.values(item)[0])[1]}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
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
                            <View style={{ flex: 1, justifyContent: 'center',  alignItems: 'center',}} >
                                <View style={styles.eventBox}>
                                    <View style={styles.eventHeader}>
                                        <Text style={{fontSize: 25, color: '#fff' }}>{title}</Text>
                                    </View>
                                    <View style={{padding: '2%', justifyContent: 'center', alignItems: 'center'}} >
                                        <Text style={{fontSize: 20, paddingBottom: '2%', fontWeight: 'bold'}}> Navn på begivenheden</Text>
                                        <TextInput
                                            placeholder={eventName}
                                            value={eventName}
                                            style={styles.inputField}
                                            onChangeText={(eventName) => this.setState({ eventName })}/>
                                    </View>
                                    <View style={{paddingTop: '2%', paddingRight: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <SimpleLineIcons style={{paddingRight: '3%', paddingBottom: '2%'}} name="clock" size={28} color="black" />
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}> Tidspunkt for begivenheden </Text>
                                    </View>
                                    <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: '2%'}}>
                                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }} >
                                            <View style={{width: '30%', }}  >
                                                <TextInput
                                                    placeholder={startTime}
                                                    value={chosenStartHours.toString() +chosenStartMinutes.toString() }
                                                    style={[styles.inputField_time, {justifyContent: 'flex-start', marginLeft: '10%'}]}
                                                    editable={true}
                                                    onFocus={() =>this.showTime(1)}
                                                />

                                            </View>
                                            <View style ={{justifyContent: 'center', alignItems: 'center'}}>
                                                <Text>  -   </Text>
                                            </View>
                                            <View style={{width: '30%'}}  >
                                                <TextInput
                                                    placeholder={endTime}
                                                    value={chosenEndHours.toString() + chosenEndMinutes.toString() }
                                                    style={[styles.inputField_time, {justifyContent: 'flex-end'}]}
                                                    onFocus={() =>this.showTime(2)}/>
                                            </View>
                                        </View>
                                        <View style={{paddingTop: '3%', paddingRight: '3%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                            <MaterialCommunityIcons style={{paddingRight: '4%', paddingBottom: '2%'}} name="calendar-check-outline" size={30} color="black" />
                                            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Dato begivenheden</Text>
                                        </View>
                                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{fontSize: 15, width: '100%' , }} > {dayFormatted} </Text>
                                        </View>
                                    </View>
                                    <View style={{paddingTop: '2%', paddingRight: '3%', paddingBottom: '2%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontSize: 20, fontWeight: 'bold'}}> Beskrivelse af begivenhed </Text>
                                    </View>
                                    <TextInput
                                        placeholder={description}
                                        value={description}
                                        style={styles.description}
                                        onChangeText={(description) => this.setState({ description })}
                                    />
                                    <View style={{ paddingTop: '8%'}}>
                                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={this.makeEvent}>
                                                <Text style={styles.buttonText}>Annuller</Text>
                                            </TouchableOpacity>
                                            <Text>   </Text>
                                            <TouchableOpacity
                                                style={styles.button}
                                                onPress={this.createEvent}>
                                                <Text style={styles.buttonText}>Opret</Text>
                                            </TouchableOpacity>
                                        </View>
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
            )
        }

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
        margin: 1,
        padding: 10,
        width: '90%'
    },
    inputField_time: {
        borderWidth: 1,
        padding: 10,
        width: '85%'
    },
    eventBox: {
        height: '70%',
        width: '85%',
        backgroundColor: 'white',
        shadowColor: '#470000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        elevation: 1,
    },
    description: {
        borderWidth: 0.5,
        width: '90%',
        height: '15%',
        marginLeft: '5%'
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
        width: '45%',
        height: '80%',
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        marginTop:7,
    },
    insideModal: {

    }
});
