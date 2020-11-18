import * as React from 'react';
import {Button, Text, View, TextInput, ActivityIndicator, StyleSheet, Alert, TouchableOpacity,} from 'react-native';
import firebase from "firebase";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createAppContainer} from "react-navigation";
import MyInvites from "./MyInvites";
import {Entypo, FontAwesome, Fontisto, MaterialIcons} from "@expo/vector-icons";
import globalStyles from "../GlobalStyles";



const TabNavigator = createBottomTabNavigator(
    {
        /*Navn på Route*/
        MyInvites: {
            screen: MyInvites,
            navigationOptions: {
                tabBarLabel:"Invitationer",
                tabBarIcon: ({ tintColor }) => (
                    <Entypo name="wallet" size={24} color={tintColor} />
                )
            },
        },
    },
    /*Generelle label indstillinger. Blot en design metode*/
    {
        tabBarOptions: {
            showIcon: true,
            labelStyle: {
                fontSize: 15,
            },
            activeTintColor: 'blue',
            inactiveTintColor: 'gray',
            size: 40
        }, initialRouteName: "MyInvites",
    },
);

const AppBottomNav = createAppContainer(TabNavigator);


export default class CreateUser extends React.Component {


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
        allUsers: null
    };

    componentDidMount() {
        /* firebase.database().ref('/usersNotApartOFAHousehold/').on('value', snapshot => {
             this.setState({ users: snapshot.val() });
     });*/
        firebase.database().ref('/allUsers/').on('value', snapshot => {
            this.setState({allUsers: snapshot.val()})
        });
       /* firebase.auth().onAuthStateChanged(currentUser => {
            this.setState({currentUser: currentUser});
        });*/
    }

    componentWillUnmount() {
    }

// Dene fremviser at vi loader. Når en operation idriftsættes, skal der vises en spinner
    startLoading = () => this.setState({ isLoading: true });
    // Når vores loading er færdig, kaldes denne metode til at fjerne spinneren
    endLoading = () => this.setState({ isLoading: false });
// Denne vises, når vi skal præsentere en fejlsbesked
    setError = errorMessage => this.setState({ errorMessage });
// Denne kaldes, når vi afprøver en operation igen og skal fjerne fejlbeskeden.
    clearError = () => this.setState({ errorMessage: null });

// EStår for at opdatere værdierne af vores inputfields, når der bliver skrevet i disse.
    handleChangeHouseHold = houseHoldName => this.setState({ houseHoldName });
    //   handleChangePassword = password => this.setState({ password });

    handleChangeEmail = email => this.setState({ email });
    handleChangePassword = password => this.setState({ password });


    handleSubmit = async () => {
        const { email, password } = this.state;
        const status = false;
        const houseHoldId = "none";
        try {
            const result = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const reference = firebase.database().ref(`/allUsers/`).push({ email, status, houseHoldId });

         //   this.setState({isAuthenticated: true});
           // this.setState({currentUser: true})
            // const reference = firebase.database().ref(`/households/`).push({houseHoldName});
            // const updateReference = reference.toString().replace("https://reactnativedbtrial.firebaseio.com", "");
        } catch (error) {
            // Vi sender `message` feltet fra den error der modtages, videre.
            this.setError(error.message);
            console.log(error.message)
        }
    };

    render () {
        const { email, password } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>Join the team!</Text>
                <Text style={styles.textSubmit}>Submit</Text>


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
        bottom:180,
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


});

