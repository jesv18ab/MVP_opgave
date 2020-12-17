import React, { Component } from 'react';
import {createBottomTabNavigator} from "react-navigation-tabs";
import CalendarView from "../CalendarComponent/CalendarView";
import WeShareView from "../EconomyComponents/WeShareView";
import AddMemberView from "../MembershipComponents/AddMemberView";
import ProfileView from "../ProfileComponents/ProfileView";
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import CommonAreaCleaningView from "../CleaningComponents/CommonAreaCleaningView";
import LaundryView from "../CleaningComponents/LaundryView";
import ListView from "../CleaningComponents/ListView";
import { AntDesign } from '@expo/vector-icons';
import HouseCleaning from "../CleaningComponents/HouseCleaning";
import EcononyView from "../CleaningComponents/EcononyView";
import CreateUser from "../GuestComponent/CreateUser";
import MyInvites from "../GuestComponent/MyInvites";
import CreateHouseHold from "../GuestComponent/CreateHouseHold";
import InitalViewNewUsers from "../GuestComponent/MainNavigationNewUserView";
import HeaderNavigation from "./HeaderNavigation";
import Logout from "../Logout";
import * as firebase from 'firebase';
import {StyleSheet, Alert} from 'react-native';

//Oprettelse af en stacknavigator for nye brugere
//Her oprettes screens til initial view, et invitationsview og skabesle af et kollektiv
const StackNavigatorNewUsers = createStackNavigator({
    InitialPage:{
        screen: InitalViewNewUsers, navigationOptions: {
            headerLeft: null
        },
    }, MyInvites: {
            screen: MyInvites, navigationOptions: ({navigation}) =>( {
                headerLeft:<HeaderNavigation navigation={navigation}/>
            }),
        },
        CreateHouseHold: {
            screen: CreateHouseHold, navigationOptions: ({navigation}) =>( {
                headerLeft:<HeaderNavigation navigation={navigation}/>
            }),
        },

},
    { initialRouteKey: 'Texttest', navigationOptions: {tabBarVisible:  false}
    }
);


//Her laver vi en stacknavigator til alle views i rengøringsoverblikket
//Heri indgår, inkøbsliste, weShare, vasketøj og rengøring
const StackNavigatorCleaningOverView = createStackNavigator(
    {
        Oversigten: {
            screen: CommonAreaCleaningView,
            navigationOptions: {
                headerTitleStyle: { alignSelf: 'center' },
            },
        },
        Laundry: {
            screen:LaundryView,
            navigationOptions: {
                headerTitleStyle: { left: 65 },
                title: 'Vasketøjslisten',
            },
        },
        ShoppingList: {
            screen: ListView,
            navigationOptions: {
                headerTitleStyle: { left: 100 },
                title: 'Indkøb',
            },
        },
        HouseCleaning: {
            screen: HouseCleaning,
            navigationOptions: {
                headerTitleStyle: { left: 75 },
                title: 'Rengøringen',
            },
        },
        EconomyView: {
            screen: EcononyView,
            navigationOptions: {
                headerTitleStyle: { left: 90 },
                title: 'WeShare',
            },
        },
    },
    { initialRouteKey: 'Oversigten'  }
);


//Her oprettese en tabnavigatorm, der indheolder profilview,kalenderview, en indgang til vores rengøringsoverblik, en logud knap og
//Et view til hpndtering af tilføjelsen af nye brugere
const TabNavigator = createBottomTabNavigator(
    {
        Profile: {
            screen: ProfileView,
            navigationOptions: {
                tabBarLabel:"Profile",
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="setting" size={24} color="black" />                 )
            },
        },
        Calendar: {
            screen: CalendarView,
            navigationOptions: {
                tabBarLabel:"Calendar",
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="calendar" size={24} color="black" />               )
            },
        },
        CleaningOverview: {
            screen: StackNavigatorCleaningOverView, navigationOptions: {
                tabBarLabel:"Overblikket", tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="home" size={24} color="black"  />
                )
            },
        },
        /*Navn på Route*/

        Members: {
            screen: AddMemberView,
            navigationOptions: {
                tabBarLabel:"Members",
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="adduser" size={24} color="black" />)
            },
        },
        Logout: {
            screen: Logout, navigationOptions: ({navigation}) => ({
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="logout" size={24} color="black" />),
                tabBarOnPress: (scene, jumpToIndex) => {
                    return Alert.alert(   // Shows up the alert without redirecting anywhere
                        'Bekræftelse'
                        , 'Er du sikker på at du vil logge ud?'
                        , [
                            {
                                text: 'Log ud', onPress: () => {
                                    firebase.auth().signOut()
                                }
                            },
                            {text: 'annuller'}
                        ]
                    );
                },
            })

        }
    },
/*Generelle  indstillinger for Tab navigatores*/
    {
        tabBarOptions: {
            showIcon: true,
            labelStyle: {
                fontSize: 15,
            },
            activeTintColor: '#5FB8B2',
            inactiveTintColor: 'gray',
            size: 40,
        }, initialRouteName: "Profile"
    },

);

//Denne stacknavigator binder vores tabnavigator for validerede brugere og gæstebrugere sammen.
//Meget vigtig for den endelige navigation
const StackNavigatorOverView = createStackNavigator(
    {
        Tabs: {
            screen: TabNavigator, navigationOptions:{
                headerShown: false
            }
        }, NewUser: {
            screen: StackNavigatorNewUsers, navigationOptions:{
                headerShown: false
            }
        }
    }
);





//Vi wrapper vores stacknavigator, som står for at binde de resterende navigatorer, ind i en appcontainer.
const MainNavigator = createAppContainer(StackNavigatorOverView);

//Denne eksporteres(Og importeres i vores App klasse)
export default MainNavigator
