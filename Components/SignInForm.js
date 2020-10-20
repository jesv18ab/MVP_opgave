import React, { Component } from 'react';
import {Alert, Text, TouchableOpacity, TextInput, View, StyleSheet, Image, LogBox} from 'react-native';
import { MaterialIcons, FontAwesome, Entypo, Ionicons, Fontisto } from '@expo/vector-icons'
import {Button} from  'react-native-paper'
import * as firebase from 'firebase';
import {createBottomTabNavigator} from "react-navigation-tabs";
import CalendarView from "./CalendarComponent/CalendarView"
import WeShareView from "./EconomyComponents/WeShareView";
import AddMemberView from "./MembershipComponents/AddMemberView";
import ProfileView from "./ProfileComponents/ProfileView";
import {createAppContainer} from "react-navigation";
import {createDrawerNavigator} from "react-navigation-drawer";
import {createStackNavigator} from "react-navigation-stack";
import CommonAreaCleaningView from "./CleaningComponents/CommonAreaCleaningView";
import LaundryView from "./CleaningComponents/LaundryView";
import GroceryShoppingView from "./CleaningComponents/GroceryShoppingView";
import ListsItems from "./CleaningComponents/ListsItems";
import ListView from "./CleaningComponents/ListView";

const StackNavigator = createStackNavigator(
    {
        Overblikket: {screen: CommonAreaCleaningView, navigationOptions: {headerShown: false,}},
        lister: { screen: ListsItems  },
        Indkøb: { screen: ListView },
    },
    { initialRouteKey: 'Oversigten' }
);

//Oprettelse af en drawernavigator, hvori vi placerer tilhørende screens
const MyDrawerNavigator = createDrawerNavigator({
    Oversigten: {
        screen: StackNavigator
    },
    Vasketøj: {
        screen:LaundryView
    },
    Indkøbsliste: {
        screen: GroceryShoppingView
    },
});

//Vi instantiere en bottomnavigator, som står for den overordnede navigering i appplikationen.
//Der  instantieres komponenter i de relevante screens samt oprettes en forbindelse til den oprettede drawernavigator
//Derudover er der benyttet ikoner
const TabNavigator = createBottomTabNavigator(
    {
        CleaningOverview: {
            screen: MyDrawerNavigator, navigationOptions: {
                tabBarLabel:"Home Page", tabBarIcon: ({ tintColor }) => (
                    <Entypo name="home" size={24} color={tintColor} />
                )
            },
        },
        /*Navn på Route*/
        Weshare: {
          screen: WeShareView,
          navigationOptions: {
            tabBarLabel:"WeShare",
            tabBarIcon: ({ tintColor }) => (
                <Entypo name="wallet" size={24} color={tintColor} />
            )
          },
        },
        Profile: {
            screen: ProfileView,
            navigationOptions: {
                tabBarLabel:"Profile",
                tabBarIcon: ({ tintColor }) => (
                    <MaterialIcons name="person-outline" size={24} color={tintColor} />                )
            },
        },
        Calendar: {
            screen: CalendarView,
            navigationOptions: {
                tabBarLabel:"Calendar",
                tabBarIcon: ({ tintColor }) => (
                    <FontAwesome name="calendar" size={24} color={tintColor} />                )
            },
        },
        Members: {
            screen: AddMemberView,
            navigationOptions: {
                tabBarLabel:"Members",
                tabBarIcon: ({ tintColor }) => (
                    <Fontisto name="persons" size={24} color={tintColor} />                )
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
        }, initialRouteName: "Profile"
    },
);

//Vi wrapper bottomnavigatoren ind i en appcontainer.
const AppBottomNav = createAppContainer(TabNavigator);

export default class SignInForm extends Component {
   //Der oprettes relevante state variabler, heriblandt varibler til håndtering
    //af credentials og en variabel, som skal tjekke, hvorvidt en person er logget ind.
    state = {
        email: '',
        password: '',
        isLoggedIn: false
    };

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
            this.setState({ isLoggedIn: true });
        } catch (error) {
           console.log(error.message);
            this.setState({ isLoggedIn: false });
        }
    };
    //HVis komponenten mountes, skal dette registreres. Dette gøres ved brug af
    //componentDidMount
    componentDidMount() {
        LogBox.ignoreAllLogs();
    this.loginUser
    }

    //I render tester vi status på isLoggedIn state variablen.
    //er variablen true, skal vi instantiere vores AppBottomNav Komponent
    //Ellers skal signIn siden fremvises
    render() {
        if(this.state.isLoggedIn){
            return(
            <AppBottomNav/>
            )
        }
        else {
            return (
                    <View style={styles.container}>
                        <Text style={styles.titleText}>Velkommen til</Text>
                        <Text style={{ fontSize: 50}} >Kollektivet!</Text>
                        <Image style={styles.welcomePic} source={require('./assetsSignInForm/house.png')}/>
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
                        <TouchableOpacity style={[styles.signInButtons, {width: 200, height: 55}]} onPress={this.loginUser} >
                            <Button color='black'>
                                Login
                            </Button>
                        </TouchableOpacity>
                        <View style={{marginTop: 20}}>
                            <TouchableOpacity style={styles.signInButtons} >
                                <Button color='black'
                                        icon={() => (
                                            <Image
                                                source={require('./assetsSignInForm/facebook_2.png')}
                                                style={{ width: 34, height: 34, tintColor: 'black' }}/>
                                        )}>
                                    Login med Facebook
                                </Button>
                            </TouchableOpacity>
                            <View style={{marginTop: 15}}>
                                <TouchableOpacity style={[styles.signInButtons, {marginTop: 5, textAlign: 'left'}]} >
                                    <Button color='black'
                                            icon={() => (
                                                <Image source={require('./assetsSignInForm/Google.png')} style={{ width: 38, height: 38, tintColor: 'black' }}/>)}>
                                        Login med Google
                                    </Button>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
        }
        }
}

//Styling komponenter til design af siden
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#EEEEEE',
    },
    titleText:{
        marginTop: 50,
        fontFamily: 'Baskerville',
        fontSize: 50,
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
        width: 280,
        height: 60,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 25,
    },
    buttonText:{
        fontFamily: 'Baskerville',
        fontSize: 20,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign:'center',
    },
    input: {
        width: 200,
        fontFamily: 'Baskerville',
        fontSize: 20,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginVertical: 10,

    }, welcomePic: {
        width: 64,
        height: 64,
    },
});
