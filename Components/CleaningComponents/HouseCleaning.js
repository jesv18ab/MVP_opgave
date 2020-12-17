//Imports
import React, { Component } from 'react';
import {StyleSheet, View, Text, TextInput, Switch, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard} from 'react-native';
import Modal from 'react-native-modal'; // 2.4.0
import DateTimePickerModal from "react-native-modal-datetime-picker";


//Denne klasse står for at administrerer rengøringsplanlægningen
export default class HouseCleaning extends React.Component {

 //Her er hardcodet tre præefinerede objekter, som printes i render. Nogle objekter skal angive at rengøringen er foregået
    //MEns andre fremviser, hvordan det ser ud for en planlagt vask
    //Derudover oprettes statevariabler, som skal styre visnignen af et modal view og dataTimePickers
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


    //I denne metode opdateres et objekt i listen, som konsekvens af en aktivitet i vores switch komponent
    //Metoden tager en status med fra det pågældende objet der skal ændres på
    //Derudover hentes det index, som objektet har i listen
    setSwitch = (status, index) => {

     //Initialisering af relevante variabler
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
      //Formatering af datoer
        let currentDate ="Udført: " + date + "-"+ month + "-" + year
        let currentDate2 ="Opdateret: " + date + "-"+ month + "-" + year
        let arr = this.state.switchItems;

        //Der oprettes et if-else statement til at styre den hpndtering der skal foregår, hvis
        //Objekt i frovejen er markeret som færdiglavet eller ej
        if (status){
          //Er opgaven udført, skal dette annulleres og aktiviteten sættes til at være opdateret og ikke udført
            arr[index].isEnabled = false;
            arr[index].date = currentDate2;
            this.setState({switchItems: arr})
        }else{
            //Her sættes opgaven til at være udført
            arr[index].isEnabled = true;
            console.log(arr[index].date);
            arr[index].date = currentDate;
            this.setState({switchItems: arr})}
    };

//Denne metode står for at håndere, når en dato er valgt i datepickeren.
    handleConfirm = (date) => {
       //Initialisering af relevante variabler
        let newDate = new Date(date);
        let month = newDate.getMonth()+1;
        let day = null;

        //Hvis den valgte dag er i starten af måneden, skal ydeligere formatering udføres
        if (newDate.getDay() < 10)
        {
            //Vi tilføjer et nul i datoen
            day = "0"+newDate.getDay()
        }
        else {
            //Hvis datoen ikke er i starten af måneden gemmes den valgte dag blot
            day = newDate.getDay()
        }
        //Samme procedure for måneder som for dage
        if (month < 10)
        {
            month = "0"+month
        }
       //Slutteligt sammenæsttes dagm månedog år i en formateret dato.
        newDate = day + "-" + month + "-" + newDate.getFullYear();
        this.setState({date: newDate})

        //Her kalder vi den metode, som skal gemme dateTimePicker komponenten
        this.hideDatePicker();
    };

    //Metoden sætter en state værdi, der vil betyde at datepickeren bliver fremvist
    showDatePicker = () => {
        this.setState({isDatePickerVisible: true})
    };
    //Metoden sætter en state værdi, der vil betyde at datepickeren bliver skjult
    hideDatePicker = () => {
        this.setState({isDatePickerVisible: false})
    };

    //Metpden står fro at oprette et nyt rengøringsobjekt
    createCleaning = () => {
       //Vi opretter og gemmer relevanteværdier og vriabler
        let arr = [];
       arr = this.state.switchItems;
     //Her oprettes det nye rengæringsobjekt
       let item= {isEnabled: false, date: "Planlagt: " +  this.state.date, name: this.state.name}
      //Objektet gemmes i en liste over alle rengæringsobjekter
       arr.push(item);
      //Vi overskriver den gamle liste med en nye liste samt sætter vores modealvarablen null,
        //Således vores modalview gemmes igen.
        this.setState({switchItems: arr, visibleModal: null })
        this.setState({visibleModal: null})
    };


    //I render opbygges siden, hvortil relevante komponenter er sat idrift for at kunne håndtere de handlinger
    //som en bruger ønsker at kunne udføære
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

//Relevant styling til komponenterne er vist herunder
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
