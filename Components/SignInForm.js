import React, { Component } from 'react';
import { Alert, Text, TouchableOpacity, TextInput, View, StyleSheet, Image } from 'react-native';
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
import CommonAreaCleaningView from "./CleaningComponents/CommonAreaCleaningView";
import LaundryView from "./CleaningComponents/LaundryView";
import GroceryShoppingView from "./CleaningComponents/GroceryShoppingView";

const MyDrawerNavigator = createDrawerNavigator({
    CommonAreas: {
        screen: CommonAreaCleaningView,
    },
    Laundry:{
        screen:LaundryView
    },
    Grocery: {
        screen: GroceryShoppingView
    }
});


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
    /*Generelle label indstillinger*/
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
const AppBottomNav = createAppContainer(TabNavigator);

export default class SignInForm extends Component {
    state = {
        email: '',
        password: '',
        isLoggedIn: false
    };

    loginUser = async () => {
        const { email, password } = this.state;
        try {
            // Here the data is passed to the service and we wait for the result
            const output =  await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log(output);
            this.setState({ isLoggedIn: true });
        } catch (error) {
           console.log(error.message);
            this.setState({ isLoggedIn: false });
        }
    };
    componentDidMount() {
    this.loginUser
    }

    render() {
        if(this.state.isLoggedIn){
            return(
            <AppBottomNav/>
            )
        }
        else {
            return (
                    <View style={styles.container}>
                        <Text style={styles.titleText}>Velkommen til Kollektivet!</Text>
                        <Image style={styles.welcomePic} source={require('./assets/house.png')}/>
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
                                Sign in
                            </Button>
                        </TouchableOpacity>
                        <View style={{marginTop: 20}}>
                            <TouchableOpacity style={styles.signInButtons} >
                                <Button color='black'
                                        icon={() => (
                                            <Image
                                                source={require('./assets/facebook_2.png')}
                                                style={{ width: 34, height: 34, tintColor: 'black' }}/>
                                        )}>
                                    Sign in with Facebook
                                </Button>
                            </TouchableOpacity>
                            <View style={{marginTop: 15}}>
                                <TouchableOpacity style={[styles.signInButtons, {marginTop: 5, textAlign: 'left'}]} >
                                    <Button color='black'
                                            icon={() => (
                                                <Image source={require('./assets/Google.png')} style={{ width: 38, height: 38, tintColor: 'black' }}/>)}
                                    >
                                        Sign in with Google
                                    </Button>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                );
        }
        }
}

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
