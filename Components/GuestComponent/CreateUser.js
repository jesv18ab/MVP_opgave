
//Imports
import * as React from 'react';
import {
    Button,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Platform
} from 'react-native';
import firebase from "firebase";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createAppContainer} from "react-navigation";
import MyInvites from "./MyInvites";
import {Entypo, FontAwesome, Fontisto, MaterialIcons} from "@expo/vector-icons";
import globalStyles from "../GlobalStyles";
import RNPickerSelect from "react-native-picker-select";

//Her oprettes en år-variabel, der indeholder et label med en værdi og en styling
const placeholderYear = {
    label: 'År',
    value: null,
    color: '#9EA0A4',
};

//Oprettelse af en månned-variabel med en værdi og farve
const placeholderMonth = {
    label: 'Måned',
    value: null,
    color: '#9EA0A4',
};

//Her oprettelse en array med alle måender på et år
const months =
    [{label: 'Januar', value: "Januar"},
        {label: 'Feb', value: "Februar"},
        {label: 'Marts', value: "Marts"},
        {label: 'April', value: "April"},
        {label: 'Maj', value: "Maj"},
        {label: 'Juni', value: "Juni"},
        {label: 'Juli', value: "Juli"},
        {label: 'Aug', value: "August"},
        {label: 'Sep', value: "September"},
        {label: 'Okt', value: "Oktober"},
        {label: 'Nov', value: "November"},
        {label: 'Dec', value: "December"},
    ];

//Her oprettes en liste med alle dage på en måned
const days =
    [{label: '1', value: "1"},
        {label: '2', value: "2"},
        {label: '3', value: "3"},
        {label: '4', value: "4"},
        {label: '5', value: "5"},
        {label: '6', value: "6"},
        {label: '7', value: "8"},
        {label: '8', value: "8"},
        {label: '9', value: "9"},
        {label: '10', value: "10"},
        {label: '11', value: "11"},
        {label: '12', value: "12"},
        {label: '13', value: "13"},
        {label: '14', value: "14"},
        {label: '15', value: "15"},
        {label: '16', value: "16"},
        {label: '17', value: "17"},
        {label: '18', value: "18"},
        {label: '19', value: "19"},
        {label: '20', value: "20"},
        {label: '21', value: "21"},
        {label: '22', value: "22"},
        {label: '23', value: "23"},
        {label: '24', value: "24"},
        {label: '25', value: "25"},
        {label: '26', value: "26"},
        {label: '27', value: "27"},
        {label: '28', value: "28"},
        {label: '29', value: "29"},
        {label: '30', value: "30"},
        {label: '31', value: "31"},
    ];

//Oprettelse af en variael til en dag
const placeholderDay = {
    label: 'Dag',
    value: null,
    color: '#9EA0A4',
};


//Oprettelse af en klass
export default class CreateUser extends React.Component {

    //Operettelse af relevante statevariabler
    state = {
        email: '',
        password: '',
        isLoading: false,
        isCompleted: false,
        errorMessage: null,
        houseHoldName: '',
        users: [],
        routename: null,
        isAuthenticated: false,
        allUsers: null,
        day:  null,
        month: null,
        year: null,
        name: null
    };

    //ComponentDidmount metode
    componentDidMount() {
        //her hentes alle brugeren fra firebase
        firebase.database().ref('/allUsers/').on('value', snapshot => {
            this.setState({allUsers: snapshot.val()})
        });


    }

    componentWillUnmount() {
    }


// Metoderne står for at opdatere værdierne af vores inputfields, når der bliver skrevet i disse.
    handleChangeHouseHold = houseHoldName => this.setState({ houseHoldName });
    handleChangeEmail = email => this.setState({ email });
    handleChangePassword = password => this.setState({ password });
    handleChangeName = name => this.setState({ name });

//Denne metode håndterer oprettelseaf en bruger. Dete er en asynkron metode
    handleSubmit = async () => {
        //Inoitialisering af variabler
        const { email, password, name, day, month, year  } = this.state;
        const birthday = {day: day, month: month, year: year};
        const status = false;
        const houseHoldId = "none";
        try {
            //Vi opretter en bruger vha. en prædefineret metode fra firebase
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
            //Brugeren oprettes i vores realtime database
            const reference = firebase.database().ref(`/allUsers/`).push({name, email, status, houseHoldId, birthday  });

        } catch (error) {
            // Vi sender `message` feltet fra den error der modtages, videre.
            this.setError(error.message);
            console.log(error.message)
        }
    };

    //I render opbygges siden med relevante inputfelter og knapper der aktiverer nødvendige metoder
    //Her er der ydermere anvendt stylings pba. det OS, som den pågæældende enhed anvender
    render () {
        const { email, password, name } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Join the team!</Text>
                <TextInput
                    placeholder="Fuldt navn"
                    value={name}
                    onChangeText={this.handleChangeName}
                    style={styles.inputField}
                />

                <View style={{bottom: 83, marginRight: '35%'}} >
                    <Text style={styles.bDay} y>Fødselsdag</Text>
                </View>
                <View style={styles.pickers} >
                    <View style={styles.selectInput} >
                        <RNPickerSelect
                            placeholder={placeholderYear}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 20,
                                    right: 10,
                                    backgroundColor: 'black'
                                },
                                placeholder: {
                                    ...Platform.select({
                                        ios: {
                                            color: 'purple',
                                            fontSize: 12,
                                            fontWeight: 'bold',                                },
                                        android: {
                                            color: 'purple',
                                            fontWeight: 'bold',
                                        },
                                    })
                                },
                            }}
                            onValueChange={(year) => this.setState({year})}
                            items={this.props.screenProps.yearsRetrieved}
                        />
                    </View>
                    <View style={styles.selectInput2} >
                        <RNPickerSelect
                            placeholder={placeholderMonth}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 20,
                                    right: 10,
                                },
                                placeholder: {
                                    color: 'purple',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                },
                            }}
                            onValueChange={(month) => this.setState({month})}
                            items={months}/>
                    </View>
                    <View style={styles.selectInput3} >
                        <RNPickerSelect
                            placeholder={placeholderDay}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 20,
                                    right: 10,
                                },
                                placeholder: {
                                    color: 'purple',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                },
                            }}
                            onValueChange={(day) => this.setState({day})}
                            items={days}
                        />
                    </View>
                </View>

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={this.handleChangeEmail}
                    style={styles.inputField}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={this.handleChangePassword}
                    secureTextEntry
                    style={styles.inputField}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={this.handleSubmit}>
                    <Text style={styles.buttonText}>Sign up </Text>
                </TouchableOpacity>

                <Text style={styles.termsText}> By register you agree to the terms</Text>

            </View>
        );
    };


}


//Styling for alle komponetner i rende
const styles = StyleSheet.create({
    error: {
        color: 'red',
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DBF1EE',
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
        bottom:65,
    },
    buttonText:{
        fontSize: 20,
        color:'white',
        fontWeight:'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputField: {
        width: 250,
        fontSize: 15,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,
        bottom:80,
    },

    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
        bottom:110,
    },

    textSubmit:{
        fontSize: 25,
        color:'black',
        bottom:100,
        alignItems: 'center',

    },
    termsText:{
        color:'grey',
        marginTop: 10,
        bottom:60,
    },
    pickers: {
        width: '30%',
        bottom: 80,
        marginRight: '30%',
        flexDirection: 'row',
        paddingRight: '5%',
    },
    selectInput: {
        ...Platform.select({
            ios: {
                marginRight: '10%',
                width: '75%'
            },
            android: {
                marginRight: '10%',
                width: '100%',
                borderWidth: 1,
                borderColor: 'black',
                right: 50
            },
        })
    },selectInput2: {
        ...Platform.select({
            ios: {
                marginRight: '10%',
                width: '100%'
            },
            android: {
                width: 120,
                borderWidth: 1,
                borderColor: 'black',
                right: 50,
                fontSize: 5,

            },
        })
    },selectInput3: {
        ...Platform.select({
            ios: {
                marginRight: '20%'
            },
            android: {
                width: '100%',
                borderWidth: 1,
                borderColor: 'black',
                right: 40
            },
        })
    },
    bDay: {
        ...Platform.select({
            ios: {
                fontSize: 20,
                color:'#5FB8B9',
            },
            android: {
                fontSize: 20,
                color:'#5FB8B9',
                left: 65
            },
        })
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        height: 50,
        fontSize: 15,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 20, // to ensure the text is never behind the icon
    },

    inputAndroid: {
        borderColor: 'purple',
        color: 'black',
        width: '100%',
    },
});
