import React, { Component } from 'react';
import {Alert, Text, TouchableOpacity, TextInput, View, StyleSheet, Image, LogBox} from 'react-native';
import { MaterialIcons, FontAwesome, Entypo, Ionicons, Fontisto } from '@expo/vector-icons'
import * as firebase from 'firebase';
import { AntDesign } from '@expo/vector-icons';
import globalStyles from "./GlobalStyles";


export default class SignInView extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
    }
    _isMounted = false;

    //Der oprettes relevante state variabler, heriblandt varibler til håndtering
    //af credentials og en variabel, som skal tjekke, hvorvidt en person er logget ind.
    state = {
        email: '',
        password: '',
        isLoggedIn: false,
        image: null,
        isNewUser: false,
        allUsers: null,
        stateOfUser: null,
        currentUser: null
    };

    //Der oprettes relevante state variabler, heriblandt varibler til håndtering
    //af credentials og en variabel, som skal tjekke, hvorvidt en person er logget ind.


    //login metode. Dette er et asynkront kald, som validerer, hvovidt email og password
    //stemmer overens med de oplysninger, som er placeret i en firebase DB
    loginUser = async () => {
        const { email, password } = this.state;
        //Vi laver en try/catch i tilfælde af at der går noget galt under det asynkrone kald.
        try {
            // Here the data is passed to the service and we wait for the result
            const output =  await firebase.auth().signInWithEmailAndPassword(email, password);
            //Hvis credentials passser, skal state variablen sætte true
            //Der er ikke oprettet fejlhåndtering endnu
            this._isMounted && this.setState({ isLoggedIn: true });
        } catch (error) {
           console.log(error.message);
            this._isMounted && this.setState({ isLoggedIn: false });
        }
    };
    //HVis komponenten mountes, skal dette registreres. Dette gøres ved brug af
    //componentDidMount
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loginUser();

    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    willSignUp =() => {
        this.props.navigation.navigate('SignUp');
    };

    //I render tester vi status på isLoggedIn state variablen.
    //er variablen true, skal vi instantiere vores AppBottomNav Komponent
    //Ellers skal signIn siden fremvises
    render() {
            return (
                    <View style={globalStyles.container}>
                        <Image style={styles.welcomePic} source={require('./assetsSignInForm/LogoKollektiv.png')}/>
                        <Text style={styles.titleText} >Kollektivet!</Text>
                        <TextInput
                            value={this.state.email}
                            keyboardType = 'email-address'
                            onChangeText={(email) => this.setState({ email })}
                            placeholder='email'
                            placeholderTextColor = 'black'
                            style={styles.input}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'password'}
                            secureTextEntry={true}
                            placeholderTextColor = 'black'
                            style={styles.input}
                        />

                        <TouchableOpacity style={[styles.signInButtons]} onPress={this.loginUser} >
                            <Text style={styles.buttonText}>Sign in</Text>
                        </TouchableOpacity>
                            <View style={{marginTop: 15}}>
                                <TouchableOpacity style={[styles.iconButtonsGoogle, {marginTop: 5}]} >
                                    <AntDesign name="google" size={24} color="black" />
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.iconButtonsFacebook,]} >
                                    <Entypo name="facebook" size={24} color="black" />
                                </TouchableOpacity>
                            </View>
                        <TouchableOpacity onPress={this.willSignUp} style={[styles.sigUpButton,]} >
                            <Text>Registrer deg på Kollektivet</Text>
                        </TouchableOpacity>
                    </View>
                );
        }

}

//Styling komponenter til design af siden
const styles = StyleSheet.create({
    container: {
         flex: 1,
         alignItems: 'center',
         justifyContent: 'center',
         backgroundColor: '#DBF1EE',
    },

    welcomePic: {
        bottom:50,
        width: 90,
        height: 90,
    },

    titleText:{

       fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',

    },
    input: {
        width: 280,
        fontSize: 15,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,

    },

    button: {
        alignItems: 'center',
        width: 200,
        height: 44,
        padding: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 25,
        marginBottom: 10,
    },

    signInButtons: {
        alignItems: 'center',
        backgroundColor: '#47525E',
        width: 280,
        height: 54,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop:7,
    },

    iconButtonsGoogle: {
        alignItems: 'center',
        borderColor:'#47525E',
        width: 125,
        height: 54,
        borderWidth:1,
        borderRadius: 5,
        marginBottom: 10,
        right:80,
        marginTop:7,
        padding:10,

    },

    iconButtonsFacebook: {
        alignItems: 'center',
        borderColor:'#47525E',
        width: 125,
        height: 54,
        borderWidth:1,
        borderRadius: 5,
        marginBottom: 10,
        bottom:65,
        padding:10,
        left:80,
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



    }
});
