import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';
import HeaderNav from "../HeaderNav";
import firebase from "firebase";
import RNPickerSelect from "react-native-picker-select";
//import SignUpView from "../SignInView";


export default class ProfileView extends React.Component{

    _isMounted = false;
state = {
    currentUser: this.props.screenProps.currentUser,
    houseHasBeenCreated: null,
    userInfo: '',
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
                        this.setState({userInfo: item})
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


    handleChangeEmail = email => this.setState({ email });
    handleChangePassword = password => this.setState({ password });
    handleChangeName = name => this.setState({ name });

    render(){
        const currentUser = this.state.currentUser;
        const {houseHasBeenCreated, userInfo} = this.state;
        if (houseHasBeenCreated === true ){
            return (
                <View style={styles.container}>
                    <Text style={styles.headerText}>Hej {userInfo.name}!</Text>
                    <TextInput
                            placeholder={userInfo.name}
                            value={userInfo.name}
                            onChangeText={this.handleChangeName}
                            style={styles.inputField}
                        />
                        <TextInput
                            placeholder={userInfo.email}
                            value={userInfo.email}
                            onChangeText={this.handleChangeEmail}
                            style={styles.inputField}
                        />
                    <TextInput
                        placeholder={userInfo.name}
                        value={userInfo.name}
                        onChangeText={this.handleChangeName}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder={userInfo.email}
                        value={userInfo.email}
                        onChangeText={this.handleChangeEmail}
                        style={styles.inputField}
                    />
                        <View style={{bottom: 83, marginRight: '35%'}}>
                            <Text style={{fontSize: 20, color:'#5FB8B9'}}>Fødselsdag</Text>
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
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#DBF1EE',
            width: '100%',
            height: '100%'
    }, inputField: {
        width: 250,
        fontSize: 15,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        marginVertical: 10,
        bottom:80,
    },
    headerText: {
        fontSize: 50,
        fontWeight:'bold',
        color:'#5FB8B2',
        bottom:100,
    },



});
