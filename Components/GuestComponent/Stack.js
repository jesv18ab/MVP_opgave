import {createStackNavigator} from "react-navigation-stack";
import MakeHouseHold from "./MakeHouseHold";
import {Entypo} from "@expo/vector-icons";
import MyInvites from "./MyInvites";
import {createAppContainer} from "react-navigation";
import * as React from "react";

const StackNavigatorNeUsers = createStackNavigator(
    {
        MakeHouseHold: {
            screen: MakeHouseHold, navigationOptions: {
                tabBarLabel:"Opret kollektiv", tabBarIcon: ({ tintColor }) => (
                    <Entypo name="home" size={24} color={tintColor} />
                )
            },
        },
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
        }, initialRouteName: "MakeHouseHold",
    },
);
const NewUsers = createAppContainer(StackNavigatorNeUsers);
export default NewUsers

