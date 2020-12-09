import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, Linking} from 'react-native';
import HeaderNav from "../HeaderNav";
import firebase, {initializeApp} from "firebase";
import RNPickerSelect from "react-native-picker-select";
import {WebBrowser} from "expo/build/removed.web";
//import SignUpView from "../SignInView";

export default class ProfileView extends React.Component{

    _isMounted = false;
state = {
    currentUser: this.props.screenProps.currentUser,
    houseHasBeenCreated: null,
    userInfo: '',
    houseHoldName: ''
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
        this._isMounted && this.getHouseHolds();
    }

    getHouseHolds = () => {
        let houseHoldName = '';
        console.log("Object.values(this.props.screenProps.houseHolds)[0]");
        console.log((Object.values(Object.values(Object.values(this.props.screenProps.houseHolds)[0].users))[0]).users);
        Object.values(this.props.screenProps.houseHolds).map((item, index) => {
          let arr = (Object.values(Object.values(Object.values(this.props.screenProps.houseHolds)[index].users))[0]).users;
           let indexOfHouseHold = index;
            arr.map((item, index) => {
                let userEmail = this.props.screenProps.currentUser.email;
                if (userEmail.toUpperCase() === item.toUpperCase()){
                    houseHoldName = Object.values(this.props.screenProps.houseHolds)[indexOfHouseHold].houseHoldName
                }
            });
        });
        this.setState({houseHoldName: houseHoldName})
    };

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
        const {houseHasBeenCreated, userInfo, houseHoldName} = this.state;
        let birthday = null
        if (userInfo.birthday !=null){
            const arr = Object.values(userInfo.birthday);
             birthday = arr[0] + ' ' + [arr[1] + ' ' + ' ' + arr[2]]
        }
        if (houseHasBeenCreated === true ){
            return (
                <View style={styles.container}>
                    <Text style={styles.headerText}>{userInfo.name}!</Text>
                    <TextInput
                            placeholder={userInfo.name}
                            value={userInfo.name}
                            onChangeText={this.handleChangeName}
                            style={styles.inputField}
                        />
                        <TextInput
                            placeholder="No data"
                            value={houseHoldName}
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
                        placeholder='No Data'
                        value={birthday}
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
