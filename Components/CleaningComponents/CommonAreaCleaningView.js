import {Image, StyleSheet, Text, View, SectionList, Platform, Alert, FlatList, TouchableOpacity} from "react-native";
import React from "react";
import HeaderClass from "./HeaderClass";
import AsyncStorage from '@react-native-community/async-storage';
import GroceryShoppingView from "./GroceryShoppingView";
import firebase from "firebase";
import ListsItems from "./ListsItems";
import HouseCleaning from "./HouseCleaning";



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
                    specificList = Object.values(snapshot.val()) ;
                    specificListKey = Object.keys(snapshot.val())[0];
                    console.log(specificListKey);
                }
            });
        });
        this.props.navigation.navigate('ShoppingList', {houseHoldKey, specificListKey}, );

    };

    gotToHouseCleaning = () => {
        this.props.navigation.navigate('HouseCleaning');
    };
    gotToEconomy = () => {
        this.props.navigation.navigate('EconomyView');
    };
    gotToLaundry = () => {
        this.props.navigation.navigate('NewUser');
    };






    render(){
        // Vi skal også bruge alle IDer, så vi tager alle keys også.
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.gotToShoppingList}>
                    <Text> Indkøbslisten</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.gotToHouseCleaning}>
                    <Text> Rengøring</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.gotToLaundry}>
                    <Text> Vasketøj</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={this.gotToEconomy}>
                    <Text> Økonomi</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    SectionHeaderStyle: {
        marginTop: '5%',
        backgroundColor: '#376B73',
        fontSize: 20,
        padding: 5,
        color: '#fff',

    },
    SectionListItemStyle: {
        fontSize: 15,
        padding: 15,
        color: '#000',
        backgroundColor: '#F5F5F5',
    },
    buttonStyle: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: "black",
        margin: 3
    }

});
