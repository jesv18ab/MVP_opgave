import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import HeaderNav from "../HeaderNav";
import firebase from "firebase";
//import SignUpView from "../SignInView";


export default class ProfileView extends React.Component{
    _isMounted = false;
state = {
    currentUser: this.props.screenProps.currentUser,
    houseHasBeenCreated: null
};

//Denne metode henter den bruger, som er valideret under login
    //Der er ikke blevet brugt tid på design eller anden funktionalitet i klassen
    getUser = () =>{
        var currentUser = null;
        try {
             currentUser =  firebase.auth().currentUser;
        }catch (e) {
            console.log(e.message)
        }
        return currentUser
    };
    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.checkIfNewUser();
        this._isMounted && this.stateUser();
    }

    stateUser = async() =>{
       await firebase.auth().onAuthStateChanged(currentUser => {
            this.setState({currentUser: currentUser});
        });
    };

    handleLogOut = async () => {
        this._isMounted &&  await firebase.auth().signOut();
    };


    checkIfNewUser = async () => {
        var status = null;
        await firebase.database().ref('allUsers').on('value', snapshot => {
            if (snapshot.val()){
            Object.values(snapshot.val()).map((item, index) => {
                    if (item.email.toUpperCase() === this.props.screenProps.currentUser.email.toUpperCase()){
                        this._isMounted && this.setState({houseHasBeenCreated: item.status})
                        status = item.status;
                        if (!item.status && item.status != null)
                        {
                            this.props.navigation.navigate('NewUser');
                        }
                    }
                }
            )
            }
        });

};


componentWillUnmount() {
    this._isMounted = false;
}

    render(){

        const currentUser = this.state.currentUser;
        const {houseHasBeenCreated} = this.state;
        if (houseHasBeenCreated === true ){
            return (
                <View style={{marginTop: 30}}>
                    <HeaderNav title={currentUser.email}/>
                    <View style={styles.container}>
                        <Text>Profile View</Text>
                        <TouchableOpacity onPress={this.handleLogOut}><Text>Dette er log ud</Text></TouchableOpacity>
                    </View>
                </View>
            )
        }else{
            return (
                <ActivityIndicator/>
            )
        }
        }


}
const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',



    },




});
