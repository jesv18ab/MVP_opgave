import React, { Component } from 'react';
import {Alert, Text, TouchableOpacity, TextInput, View, StyleSheet, Image, LogBox} from 'react-native';
import { MaterialIcons, FontAwesome, Entypo, Ionicons, Fontisto } from '@expo/vector-icons'
import {Button} from  'react-native-paper'
import * as firebase from 'firebase';
import {createBottomTabNavigator} from "react-navigation-tabs";
import CalendarView from "../CalendarComponent/CalendarView";
import WeShareView from "../EconomyComponents/WeShareView";
import AddMemberView from "../MembershipComponents/AddMemberView";
import ProfileView from "../ProfileComponents/ProfileView";
import {createAppContainer} from "react-navigation";
import {createDrawerNavigator} from "react-navigation-drawer";
import {createStackNavigator} from "react-navigation-stack";
import CommonAreaCleaningView from "../CleaningComponents/CommonAreaCleaningView";
import LaundryView from "../CleaningComponents/LaundryView";
import GroceryShoppingView from "../CleaningComponents/GroceryShoppingView";
import ListsItems from "../CleaningComponents/ListsItems";
import ListView from "../CleaningComponents/ListView";
import { AntDesign } from '@expo/vector-icons';
import globalStyles from "../GlobalStyles";
import HouseCleaning from "../CleaningComponents/HouseCleaning";
import EcononyView from "../CleaningComponents/EcononyView";
import CreateUser from "../GuestComponent/CreateUser";
import MyInvites from "../GuestComponent/MyInvites";
import CreateHouseHold from "../GuestComponent/CreateHouseHold";
/*her ligger facebook og google utkast før frontend redigert*/
/*
<View style={{marginTop: 20}}>
    <TouchableOpacity style={styles.iconButtons} >
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
        <TouchableOpacity style={[styles.iconButtons, {marginTop: 5, textAlign: 'left'}]} >
            <Button color='black'
                    icon={() => (
                        <Image source={require('./assetsSignInForm/Google.png')} style={{ width: 38, height: 38, tintColor: 'black' }}/>)}>
                Login med Google
            </Button>
        </TouchableOpacity>

    </View>

</View>
*/
/*const MyDrawerNavigator = createDrawerNavigator({
    Oversigten: {
        screen: StackNavigator
    },
    Vasketøj: {
        screen:LaundryView
    },
    Indkøbsliste: {
        screen: GroceryShoppingView
    },
})*/



//Oprettelse af en drawernavigator, hvori vi placerer tilhørende screens
const StackNavigatorNewUsers = createStackNavigator({
        CreateHouseHold: {
            screen: CreateHouseHold,
        },
    MyInvites: {
    screen: MyInvites,
},
},
    { initialRouteKey: 'CreateHousehold', navigationOptions: {tabBarVisible:  false}
    }
);



const StackNavigatorOverView = createStackNavigator(
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



//Vi instantiere en bottomnavigator, som står for den overordnede navigering i appplikationen.
//Der  instantieres komponenter i de relevante screens samt oprettes en forbindelse til den oprettede drawernavigator
//Derudover er der benyttet ikoner
const TabNavigator = createBottomTabNavigator(
    {
        CleaningOverview: {
            screen: StackNavigatorOverView, navigationOptions: {
                tabBarLabel:"Home Page", tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="home" size={24} color="black"  />
                )
            },
        },
        NewUser: {
            screen: StackNavigatorNewUsers
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
                    <AntDesign name="adduser" size={24} color="black" />                  )
            },
        },

        Profile: {
            screen: ProfileView,
            navigationOptions: {
                tabBarLabel:"Profile",
                tabBarIcon: ({ tintColor }) => (
                    <AntDesign name="setting" size={24} color="black" />                 )
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
        }, initialRouteName: "NewUser"
    },
);

//Vi wrapper bottomnavigatoren ind i en appcontainer.
const MainNavigator = createAppContainer(TabNavigator);

export default MainNavigator
