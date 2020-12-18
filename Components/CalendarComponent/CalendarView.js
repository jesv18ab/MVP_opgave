//Imports
import React, { Component } from 'react';
import {StyleSheet, Text, View, Alert, TouchableOpacity, Image, Linking, Modal,
    TouchableHighlight, TextInput, Button, ScrollView, FlatList, ActivityIndicator, Platform
} from 'react-native';
import TimePicker from "react-native-simple-time-picker";
import firebase from "firebase";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { format } from "date-fns";
import { SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
const title = "Opret Begivenhed";


//Denne klasse står for at håndtere den interne kalender
export default class CalendarView extends Component {

    //Der oprettes en constructor, der tager props med som argument
    //Derudocer sættes startværdier for state variablerne.
    // Der er mange states at holde styr på  i denne klasse
    constructor(props) {
        super(props);
        this.state = {
            key: null,
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
            date: null,
            isLoading: false,
            isDatePickerVisibleStart: false,
            isDatePickerVisibleEnd: false,
            createEvent: 'Opret'
        };
        //Står for at olde styr på ændringer i datoen
        this.onDateChange = this.onDateChange.bind(this);
    }
    //Håndterer de metoder som skal kaldes når komponenter monteres
    componentDidMount() {
        this.getHouseHoldId();
    }

    //Når der bliver valgt et tidspunkt u vores dateTaimePicker, skal dette tidspunkt formateres
    //Denne formatering står nedenstående metode for
    handleConfirmEnd = (time) => {

       //Initialisering af relevante variabler
        //Metoden relaterer sig kun til sluttidspunktet for en begivenhed
        let minutes = null;
        let hours = null;

        //Hvis antallet af valgte minutter er under ti skal dette minuttal formateres
        if (time.getMinutes() < 10 ){
            //Her foregår formateringen
            minutes = "0"+time.getMinutes().toString()
        //Efter formateringen gemmes minuttallet i en statevariabel
            this.setState({chosenEndMinutes: minutes})
        } else {
            //Er minuttallet over 10, hentes minutterne o gemmes i statevariablen
            minutes = time.getMinutes().toString()
            this.setState({chosenEndMinutes: minutes})
        }

        //Herunder formateres der på samme vis, som det blev gjort med minutterne.
        //Her blot med timer
        if (time.getHours() < 10 ){
            hours = "0"+time.getHours().toString() + ":"
            this.setState({chosenEndHours: hours})

        } else {
            hours = time.getHours().toString() + ":"
            this.setState({chosenEndHours: hours})
        }

        //slutteligt kaldes den metode, som skal står for at skjule vores dateTimePicker
        this.hideDatePickerEnd();
    };
    //Denne metode er nøjagtig ens med handleConfirmEnd, blot for starttidspunktet
    handleConfirmStart = (time) => {
        let minutes = null;
        let hours = null;
        if (time.getMinutes() < 10 ){
            minutes = "0"+time.getMinutes().toString()
            this.setState({chosenStartMinutes: minutes})
        } else {
            minutes = time.getMinutes().toString()
            this.setState({chosenStartMinutes: minutes})
        }
        if (time.getHours() < 10 ){
            hours = "0"+time.getHours().toString() + ":"
            this.setState({chosenStartHours: hours})
        } else {
            hours = time.getHours().toString() + ":"
            this.setState({chosenStartHours: hours})
        }
        this.hideDatePickerStart();
    };

    //I nedenstående metode hentes id'et for det household, som den pågældende bruger er en del af
    getHouseHoldId = () => {
     //Oprettelse af variabel, som id'et skal gemmes i
        let houseHoldId = null;
    //Vi henter alle brugere. Disse er parset fra App.js
        const allUsers = Object.values(this.props.screenProps.allUsers);

       //Vi looper igennem alle brugerne. Hvis mail for et bruger objekt er ens med den nuværende brugers
        //Henter vi household id'et fra brugerobjektet
        allUsers.map((item, index) => {
            if(item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                houseHoldId = item.houseHoldId
            }
        });

        //Vi bruger den fundne household ID ti at det pågældende kollektiv
        firebase.database().ref(`/households/${houseHoldId}/events/`).on('value', snapshot => {
            if (snapshot.val()){

               //Her oprettes et array til alle begivenheder i kollektivet
                let arr = [];
                Object.values(Object.values(Object.values(snapshot.val()))).map((item, index) => {
                    arr.push(Object.values(Object.values(item)[0])[0])
                });
                //Vi formatere arrayet, på en måde, som muliggør at vi kan markere dagene for begivenhederne i kalenderen
                arr =  arr.reduce((c, v) => Object.assign(c, {[v]: {selected: true, endingDay: true, color: 'green', textColor: 'gray'}}), {});

                //Datoerne gemmes i et statearray
                this.setState({dates: arr});

                //Alle events gemmes i en statevariabel
                this.setState({allHouseHoldEvents: snapshot.val()});
            }
            }
        );
        //Vi gemmer household Id
        this.setState({houseHoldId: houseHoldId })

    };

    //Metoden herunder står for at fremvise den modalformular, der står fro at hente info om begivenheden
    makeEvent =() =>{
        //Vi sætter label for opret knappen i formularen
        this.setState({createEvent: 'Opret'})
      //Vi sørger fo at alle værdier i formularen er nukstillede
        this.reset();

       //Dernæst sættes modalvariablen til at være true, hvis den er false og omvendt
        if (this.state.setEventModalVisible === false){
            this.setState({setEventModalVisible: true})
        } else if(this.state.setEventModalVisible === true) {
            this.setState({setEventModalVisible: false})
        }
    };
    //Metoder som håndtere skiftende datoer

   //MEtoden herunder er anvedt til at styre  hvis en dato ændres
    //Metoden tager en dato med som parameter
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

  //Denne metode når vi implementerer google kalender
    calendar = () => {
        try {
            Linking.openURL('https://calendar.google.com/calendar/u/0/r')
        } catch (e) {
            console.log(e.message);
        }
    };

    //DEnne metode står for at lave en alert, der skal have bekræftet, hvorvidt en bruger
    //ønsker at oprette en begivenhed
    //MEtoden tager den valgte dag med som parameter
    newEvent = ({day}) => {
        //parameteren bliver gemt i en statevriabel
        this.setState({day: day});
        //Her laves en aler. Trykkes der på opret, vil formularen fremvises
        //Trykes der cancel, returnerer viewet til sit udganspunkt
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

    //Følgende metoder står for at håndtere fremvisning af dateTimerPickers. Her både fro start og slut tidspunkter

    //Fremviser start tidspunkt
    showDatePickerStart = () => {
        this.setState({isDatePickerVisibleStart: true})
    };

    //Skjuler, når starttidspunkt er valgt
    hideDatePickerStart = () => {
        this.setState({isDatePickerVisibleStart: false})
    };

   //De to nedenstående metoder er helt ligmed metoderne for showDatePickerStart & hideDatePickerStart
    //Her blot for sluttidspunktet
    showDatePickerEnd = () => {
        this.setState({isDatePickerVisibleEnd: true})
    };
    hideDatePickerEnd = () => {
        this.setState({isDatePickerVisibleEnd: false})
    };

    //Denne bestemmer om den pågældende bruger er på en IOS enhed eller en android enhed
    //Bruger vi en IOS enhed, vil der blive vist et view til at vælge tidspunkt
    //Anvendes der en android enhed, vil der blive vist et andet view til at vælge tidspunkt
    showTime = type =>{

      //IOS enhed
        if (Platform.OS === 'ios')
        {
            this.setState({type: type});
            // this.setState({setEventModalVisible: false})
            if (this.state.setTimeVisible === false){
                this.setState({setTimeVisible: true})
            } else if(this.state.setTimeVisible === true) {
                this.setState({setTimeVisible: false})
            }
        }

        //Android enhed
        if (Platform.OS === 'android');
        {
            if (type === 1){
                this.showDatePickerStart()
            }else if ( type === 2){
                this.showDatePickerEnd()
            }
        }

    };

//Denne metode står for at formatere starttidspunktet
    setTimeStartTime = () => {
     // vi initialiserer værdierfor miutter og timer
        let minutesBelow = 0;
        let hoursBelow = 0;

        //Hvis det valgte antal timer er under 10, skal dette tidspunkt formateres
        if (this.state.selectedHours < 10){
            hoursBelow = hoursBelow.toString()+this.state.selectedHours.toString()+":";
            this.setState({chosenStartHours: hoursBelow})
        }
        //Ellers gemmer vi blot timetallet i en state variabel
        else {
            this.setState({chosenStartHours: this.state.selectedHours + ":"})
        }

        //Her tjekker vi om det valgte minuttal er under 10.

        //Hvis minuttallet er under 10 skal dette ormateres
        if (this.state.selectedMinutes < 10){
            minutesBelow = minutesBelow.toString()+this.state.selectedMinutes.toString()
            this.setState({chosenStartMinutes: minutesBelow})
        }

        //Ellers gemmer vi blot minuttallet i en statevariabel
        else {
            this.setState({chosenStartMinutes: this.state.selectedMinutes})
        }

        //Vi nulstiller det valgte antal timer, minutter samt skjluer timepickeren
        this.setState({selectedHours: 12 });
        this.setState({selectedMinutes: 30 });
        this.setState({setTimeVisible: false})
    };

    //Metoden her bestemmer, hvorvidt vi vil sætte begivnhedens starttidspunkt eller slut tidspunkt pba.
    //Den parameter, som er sendt med i metode
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

    //MEd så mange statevariabler, er det belejligt at oprette en metode, som nulstiller dem alle på én gang
    //Det er netop formålet med reset-metoden
    reset = () => {
        this.setState({day: null, time: 12, selectedHours: 12, selectedMinutes: 30, chosenStartHours: "", chosenStartMinutes: "", chosenEndHours: "", chosenEndMinutes: "", type: null, description: "Beskrivelse af Begivenhed....", eventName: "Angiv begivenhedens navn", setTimeVisible: false, setEventModalVisible: false, startTime: "Fra", endTime: 'Til', date: null, createEvent: 'Opret'
        })
    };

    //Denne metode er i logik fuldstændig ligmed setTimeStartTime
    //Dog med fokus på sluttidspunktet
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

   //Denne metode står for den begivenhed, som en bruger har trykket på nede i det horisontale scrollview i render
    //Metoden tager et kalender item med samt et id
    showEvent = (item, key) => {

       //Først gemmes en række relevante værdier fra kalender objekten
        const date =  Object.values(Object.values(Object.values(item)[0])[0])[0];
        const description =  Object.values(Object.values(Object.values(item)[0])[0])[1];
        const endTime =   Object.values(Object.values(Object.values(item)[0])[0])[2];
        const eventName =   Object.values(Object.values(Object.values(item)[0])[0])[3];
        const startTime =   Object.values(Object.values(Object.values(item)[0])[0])[4];

      //Dernæst formateres datpen
        let newdate = new Date(date);
        let dayFormatted = format(newdate, "dd MMMM yyyy ")

       //Slutteligt sættes en række state variabler til at være de værdier, som er hentet fra kalender objektet
        this.setState({key: key, endTime: endTime, date: dayFormatted, description: description, eventName: eventName, startTime: startTime, setEventModalVisible: true, createEvent: 'Rediger' })
    };

    //Denne metode står fro at oprette eeller opdatere en begivenhed
    createEvent = () => {

      //Først tester vi om metoden er kaldt i tildfælde af en oprettelse eller en opdatering
        if (this.state.createEvent === "Rediger"){

           //Her ønkser brugeren at opdatere en eksisterende begivenhed
            //Derfor gemmes en række værider fra objektet
            let { date, description, eventName  } = this.state;
            let startTime = this.state.chosenStartHours + this.state.chosenStartMinutes;
            let endTime = this.state.chosenEndHours + this.state.chosenEndMinutes;
           //værdierne er inklusiv de opdaterede værider
            try {
                //MEd alle de nye værdier gemt i variabler, kaledes en update metode på databasen.
                //Herved opdateres kaledner objektet
                const reference = firebase.database().ref(`/households/${this.state.houseHoldId}/events/${this.state.key}/event`).update({date: date, description: description, endTime: endTime, eventName:  eventName, startTime: startTime});
                // Når bilen er ændret, går vi tilbage.
                Alert.alert("Din info er nu opdateret");
            } catch (error) {
                Alert.alert(`Error: ${error.message}`);
            }

        }
       //I else kodeblokken vil vi oprette en ny begivenhed
      //Vi starter med at gemme en række relevante værdier
        else {
        let startTime = this.state.chosenStartHours + this.state.chosenStartMinutes;
        let endTime = this.state.chosenEndHours + this.state.chosenEndMinutes;
        const { eventName, description, houseHoldId, day } = this.state;

        //Dernærst oprettes et samlet objekt, som indtager alle værdierne
        let event = {
            date: day.dateString,
            eventName: eventName,
            startTime: startTime,
            endTime: endTime,
            description: description,
        };

      //Objektte pushes til firebasen og skaber derved en ny kalender begivenhed
        firebase.database().ref(`/households/${houseHoldId}/events/`).push({event});
        }

       //Slutteligt vil alle værdierne nulstilles
        this.reset()
    };



    //I render testes først, hvrvidt der overhovedet er nogle kalender objekter
    //Hvis ikke der er kalender objekter fremvises et view uden et horisontalt scroll, hvor kalenderen stadig er tilstede
    //Er der derimod kalender objekter, vil dagene for disse markeres i kalenderen
    //For hver enkelt kalender objekt udprintes et begivenhedsview, som indsættes i et horisontal scrollview.
    //Derudover er der en række variabel initialiseringer og styling f de forskellige komponenter
    render() {
        const { selectedHours, selectedMinutes, chosenStartHours, chosenStartMinutes, chosenEndHours, chosenEndMinutes, houseHoldId, showCalendar, day, startTime, endTime, date } = this.state;
        const {  setEventModalVisible, setTimeVisible, description, descriptionPlaceholder, eventName, eventNamePlaceHolder, dates, isDatePickerVisibleStart, isDatePickerVisibleEnd } = this.state;
        let dayFormatted = null;
      if (day){

          let newdate = new Date(day.dateString);
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
                    <Text style={styles.headerText}>Kalender</Text>
                    <View>
                        <Text style={{zIndex: 10, marginLeft: '40%', marginTop: '15%', position: 'absolute', fontSize: 20}}></Text>
                        <View style={{ height: '65%', paddingBottom: '1%', marginTop:'5%', backgroundColor: 'white'}}>
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
                                            onChangeText={(eventName) => this.setState({ eventName })}
                                            clearTextOnFocus={true}
                                            onFocus= {() => this.setState({eventName : ''})}
                                        />
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
                                        onFocus= {() => this.setState({description : ''})}
                                        onChangeText={(description) => this.setState({ description })}
                                        clearTextOnFocus={true}
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
                                                <Text style={styles.buttonText}>{this.state.createEvent}</Text>
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
                        </Modal>
                    </View>


                </View>

            );

        } else{
            const { selectedHours, selectedMinutes, chosenStartHours, chosenStartMinutes, chosenEndHours, chosenEndMinutes, houseHoldId, showCalendar, day, startTime, endTime, date } = this.state;
            const {  setEventModalVisible, setTimeVisible, description, descriptionPlaceholder, eventName, eventNamePlaceHolder, dates, isDatePickerVisibleStart, isDatePickerVisibleEnd } = this.state;
            return(
                <View style={{flex: 1, backgroundColor: 'white' }}>
                    <Text style={styles.headerText}>Kalender</Text>
                    <View>
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
                                <TouchableOpacity key={index} onPress={() => this.showEvent ({item}, eventKeys[index])} style={{width: 190, height: '100%'}}>
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
                                            onChangeText={(eventName) => this.setState({ eventName })}
                                            onFocus= {() => this.setState({eventName : ''})}
                                            clearTextOnFocus={true}
                                        />
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
                                        onFocus= {() => this.setState({description : ''})}
                                        style={styles.description}
                                        onChangeText={(description) => this.setState({ description })}
                                        clearTextOnFocus={true}
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
                                                <Text style={styles.buttonText}>{this.state.createEvent}</Text>
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
                    {this.renderButton()}
                </View>
            )
        }
    }
    renderButton = () => {
        const { isLoading } = this.state;
        if (isLoading) {
            return <ActivityIndicator/>;
        }
        return <View></View> ;
    };



}



//Oprettelse af styling til komponenterne i render
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
    headerText: {
        left: 135,
        fontSize: 35,
        fontWeight:'bold',
        color:'#5FB8B2',
        top: 30,
        height: '7%'
    }
});
