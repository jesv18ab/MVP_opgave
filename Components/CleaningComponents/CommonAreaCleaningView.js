import {Image, StyleSheet, Text, View, SectionList, Platform, Alert, FlatList, TouchableOpacity} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";
import AsyncStorage from '@react-native-community/async-storage';
import firebase from "firebase";
import HouseCleaning from "./HouseCleaning";
import globalStyles from "../GlobalStyles";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';





export default class CommonAreaCleaningView extends React.Component {
    _isMounted = false;
    //Her instantieres state variabler
    state = {
        groceryLists: [],
        routename: null,
        checkList: [],
        identifiers: [],
        stateKeys: [],
        allUsers: [],
        households: []
    };

    //Når komponenten mounter, skal en array med alle lister hentes
    componentDidMount() {
        this._isMounted = true;
        var allUsers = [];

        firebase.database().ref('/allUsers/').on('value', snapshot => {
            this.setState({allUsers: snapshot.val()});
        });

    }
    componentWillUnmount() {
        this._isMounted = false;
    }


    gotToShoppingList = () => {
        var specificList= [];
        var specificListKey= [];
        let houseHoldKey = null;
        const allUsers = Object.values(this.state.allUsers);
        console.log(this.props.screenProps.currentUser);
        allUsers.map((item, index) => {
            if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                this.setState({houseHoldId: item.houseHoldId });
                houseHoldKey = item.houseHoldId;
            }

            firebase.database().ref(`/households/${houseHoldKey}/groceryList`).on('value', snapshot => {
                if (snapshot.val()){
                    this.props.navigation.navigate('ShoppingList', {houseHoldKey, specificListKey: Object.keys(snapshot.val())[0] }, );
                }
            });
        });
    };

    gotToHouseCleaning = () => {
        this.props.navigation.navigate('HouseCleaning');
    };
    gotToEconomy = () => {
        this.props.navigation.navigate('EconomyView');
    };
    gotToLaundry = () => {
        this.props.navigation.navigate('Laundry');
    };


    render(){
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        return(
            <View style={globalStyles.container}>
                <Text style={styles.headerText}> Your private space</Text>


                <TouchableOpacity style={styles.shoppingListButton} onPress={this.gotToShoppingList}>
                    <AntDesign style={styles.shoppingListIcon} name="shoppingcart" size={30} color="black" />
                    <Text> Indkøbslisten</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.cleaningButton} onPress={this.gotToHouseCleaning}>

                    <MaterialCommunityIcons  style={styles.cleaningIcon} name="broom" size={30} color="black" />
                    <Text> Rengøring</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.laundryButton} onPress={this.gotToLaundry}>
                    <MaterialIcons style={styles.laundryIcon} name="local-laundry-service" size={30} color="black" />
                    <Text> Vasketøj</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.economyButton} onPress={this.gotToEconomy}>
                    <AntDesign style={styles.economyIcon} name="wallet" size={30} color="black" />
                    <Text> Økonomi</Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.rate} >

                    <Text style={styles.headerRate}> Rate us!</Text>

                    <AntDesign style={styles.star1} name="staro" size={24} color="black" />
                    <AntDesign  style={styles.star2} name="staro" size={24} color="black" />
                    <AntDesign  style={styles.star3} name="staro" size={24} color="black" />
                    <AntDesign  style={styles.star4} name="staro" size={24} color="black" />


                    <Text style={styles.textRate}> Your opinion matters!</Text>
                        <Text style={styles.textRate}>How would you rate Kollektivet?</Text>
                </TouchableOpacity>




            </View>
        )
    }

}
const styles = StyleSheet.create({

    headerText:{
        fontSize: 35,
        bottom:20,
        fontWeight:'bold',
        marginTop:20,
        marginBottom:20,
        color:'#5FB8B2',


    },

   shoppingListIcon:{
        marginTop:30,

   },

    shoppingListButton:{
        width: 120,
        height: 120,
        margin: 3,
        alignItems:'center',
        right:100,
        borderRadius:5,
        backgroundColor:'#5FB8B2',
    },

    cleaningButton:{
        width: 120,
        height: 120,
        margin: 3,
        alignItems:'center',
        left:100,
        borderRadius:5,
        backgroundColor:'#5FB8B2',
        bottom:128,
    },

    cleaningIcon:{
        marginTop:30,
    },


    laundryIcon:{
        marginTop:30,

    },

    laundryButton:{
        width: 120,
        height: 120,
        margin: 3,
        alignItems:'center',
        right:100,
        borderRadius:5,
        backgroundColor:'#5FB8B2',
        bottom:75,
    },

    economyIcon:{
        marginTop:30,
    },

    economyButton:{
        width: 120,
        height: 120,
        margin: 3,
        alignItems:'center',
        left:100,
        borderRadius:5,
        backgroundColor:'#5FB8B2',
        bottom:200,
    },


    rate:{
        width: 350,
        height: 120,
        backgroundColor:'white',

        borderRadius: 5,
        bottom:100,
        alignItems:'center',
    },

    headerRate:{
        fontSize: 20,
        marginBottom:10,

    },

    star1:{
        right:50,

    },

    star2:{
        right:20,
        bottom:24,
    },

    star3:{
        left:10,
        bottom:48,
    },

    star4:{
        left:40,
        bottom:72,
    },

    textRate:{
        marginTop:3,
        bottom:65,
    },



    buttonStyle: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "black",
        margin: 3
    }

});
