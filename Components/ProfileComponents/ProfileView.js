import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import HeaderNav from "../HeaderNav";
import firebase from "firebase";
//import SignUpView from "../SignInView";


export default class ProfileView extends React.Component{

state = {
    currentUser: this.props.screenProps.currentUser
};

//Denne metode henter den bruger, som er valideret under login
    //Der er ikke blevet brugt tid på design eller anden funktionalitet i klassen
    getUser = () =>{
        var currentUser = null;
        try {
             currentUser =  firebase.auth().currentUser;
             console.log("CurrentUser" + currentUser)
        }catch (e) {
            console.log(e.message)
        }
        return currentUser
    };
    componentDidMount() {
        firebase.auth().onAuthStateChanged(currentUser => {
            this.setState({currentUser: currentUser});
        });
    }

    handleLogOut =  () => {
         firebase.auth().signOut();
    };

    newUserPage =() =>{
        this.props.navigation.navigate('NewUser');
    };

    render(){
        console.log("Dette er profileview");
        const currentUser = this.state.currentUser;
        if (currentUser) {
            return (
                <View style={{marginTop: 30}}>
                    <HeaderNav title={currentUser.email}/>
                    <View style={styles.container}>
                        <Text>Profile View</Text>
                        <TouchableOpacity onPress={this.handleLogOut}><Text>Dette er log ud</Text></TouchableOpacity>
                    </View>
                </View>
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
