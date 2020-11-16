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

//Oprettelse af en drawernavigator, hvori vi placerer tilhørende screens
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



const StackNavigatorCleaningOverView = createStackNavigator(
    {
        Oversigten: {
            screen: CommonAreaCleaningView
        },
        Laundry: {
            screen:LaundryView
        },
        ShoppingList: {
            screen: ListView
        },
        HouseCleaning: {
            screen: HouseCleaning
        },
        EconomyView: {
            screen: EcononyView
        },

    },
    { initialRouteKey: 'Oversigten'  }
);


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
        CleaningOverview: {
            screen: StackNavigatorCleaningOverView, navigationOptions: {
                tabBarLabel:"Home Page", tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="home" size={24} color="black"  />
                )
            },
        },
        /*Navn på Route*/
        Weshare: {
            screen: WeShareView,
            navigationOptions: {
                tabBarLabel:"WeShare",
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="wallet" size={24} color="black" />
                )
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
        Members: {
            screen: AddMemberView,
            navigationOptions: {
                tabBarLabel:"Members",
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="adduser" size={24} color="black" />)
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
            activeTintColor: '#5FB8B2',
            inactiveTintColor: 'gray',
            size: 40,
        }, initialRouteName: "Profile"
    },
);


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



//Vi instantiere en bottomnavigator, som står for den overordnede navigering i appplikationen.
//Der  instantieres komponenter i de relevante screens samt oprettes en forbindelse til den oprettede drawernavigator
//Derudover er der benyttet ikoner


//Vi wrapper bottomnavigatoren ind i en appcontainer.
const MainNavigator = createAppContainer(StackNavigatorOverView);

export default MainNavigator
